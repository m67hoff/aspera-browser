import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { AsperaNodeApiService, DirList, NodeAPIcred } from './services/aspera-node-api.service';
import { CreateDirDialogComponent } from './dialog/create-dir-dialog.component';
import { DeleteConfDialogComponent } from './dialog/delete-conf-dialog.component';

import { Logger } from './logger/logger.module';
import { Config } from './config/config.module';
import { ZlibB64 } from './zlib-b64/zlib-b64.module';

import { environment } from '../environments/environment';

declare var AW4: any;
declare var moment: any;

interface BreadcrumbNav { dirname: string; path: string; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  versionFooter: string = environment.package.name + ' v' + environment.package.version + ((environment.production) ? 'prod' : 'dev');

  asperaWeb: any;
  connectSettings = {
    allow_dialogs: false
  };

  // config file settings duplicate for supported keys & defaults
  config = {
    logLevel: 'WARN',
    apiConnectProxy: '',
    isFixedURL: false,
    fixedURL: '',
    isFixedConnectAuth: false,
    fixedConnectAuth: false,
    enableGoto: false,
    enableCredLocalStorage: true,
    defaultCred: {
      nodeURL: 'https://demo.asperasoft.com:9092',
      nodeUser: 'aspera',
      nodePW: 'demoaspera',
      useTokenAuth: false
    },
    connectInstaller: '//d3gcli72yxqn2z.cloudfront.net/connect/v4',
    connectMinVersion: '3.8.1'
  };

  uiCred: NodeAPIcred;
  dirList: DirList;
  breadcrumbNavs: Array<BreadcrumbNav>;
  totalFiles: number;
  totalBytes: number;
  totalDirs: number;
  allTransfersList = [];
  runningTransfers: number;

  displayedColumns = ['select', 'type', 'basename', 'size', 'mtime'];
  dataSource = new MatTableDataSource();
  selection: SelectionModel<any>;

  HTTPerror: HttpErrorResponse = undefined;
  APIerror: string = undefined;

  isConnected = false;
  browseInProgress = false;
  hidePW = true;
  showHelp = false;
  isDragOver = false;

  isLoaded = {};


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private log: Logger,
    private configFile: Config,
    private z: ZlibB64,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private nodeAPI: AsperaNodeApiService,
    private activatedRoute: ActivatedRoute
  ) {
    this.log.debug('config File & Storage: ', configFile);
    this.configFile.updateDef(this.config);
    this.log.info('App config: ', this.config);

    nodeAPI.setAPIconnectProxy(this.config.apiConnectProxy);
    nodeAPI.setCred(this.config.defaultCred);

    // get or load uiCred from nodeAPI
    if (this.config.enableCredLocalStorage) {
      this.uiCred = nodeAPI.loadCred();
      if (this.config.isFixedURL) { this.uiCred.nodeURL = this.config.fixedURL; }
      if (this.config.isFixedConnectAuth) { this.uiCred.useTokenAuth = this.config.fixedConnectAuth; }
      this.nodeAPI.saveCred(this.uiCred);
    } else {
      this.uiCred = nodeAPI.getCred();
    }

    this.selection = new SelectionModel<any>(true, []);

    this._loadLib('asperaweb', this.config.connectInstaller + '/asperaweb-4.min.js');
    // this._loadLib('connectinstaller', this.config.connectInstaller + '/connectinstaller-4.min.js');
  }

  private _loadLib(name: string, url: string) {
    this.log.debug('preparing to load...', url);
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.onload = () => {
      this.isLoaded[name] = true;
      this.log.debug('loaded lib: ', url);
      this.log.debug('isloaded: ', this.isLoaded);
      /* tslint:disable:no-string-literal */
      // if (this.isLoaded['asperaweb'] && this.isLoaded['connectinstaller']) { this._initAsperaconnect(); }
      if (this.isLoaded['asperaweb']) { this._initAsperaconnect(); }
      /* tslint:enable:no-string-literal */
    };
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  private _initAsperaconnect() {
    this.asperaWeb =
      new AW4.Connect({ sdkLocation: this.config.connectInstaller, minVersion: this.config.connectMinVersion, pollingTime: 3000, dragDropEnabled: true });
    const asperaInstaller = new AW4.ConnectInstaller({ sdkLocation: this.config.connectInstaller });
    asperaInstaller.supportsInstallingExtensions = true;

    this.asperaWeb.addEventListener(AW4.Connect.EVENT.STATUS, (eventType, status) => {
      this.log.debug('AsperaInstaller status: ', status);

      switch (status) {
        case AW4.Connect.STATUS.INITIALIZING:
          asperaInstaller.showLaunching();
          break;
        case AW4.Connect.STATUS.FAILED:
          asperaInstaller.showDownload();
          break;
        case AW4.Connect.STATUS.OUTDATED:
          asperaInstaller.showUpdate();
          break;
        case AW4.Connect.STATUS.RUNNING:
          asperaInstaller.connected();
          break;
        case AW4.Connect.STATUS.EXTENSION_INSTALL:
          asperaInstaller.showExtensionInstall();
          break;
      }
    });

    this.asperaWeb.addEventListener(AW4.Connect.EVENT.TRANSFER, (eventType, allTransfersInfo) => {
      if (allTransfersInfo.result_count > 0) {
        this.log.debug('AllTransfersInfo: ', allTransfersInfo);

        allTransfersInfo.transfers.forEach(incomingTI => {
          this.log.debug(
            'TransferInfo: ' + incomingTI.title + ' file ' + incomingTI.current_file
            + '\n' + incomingTI.calculated_rate_kbps + ' kbps ' + Math.floor(incomingTI.calculated_rate_kbps / 8) + ' kBps '
            + incomingTI.remaining_usec + ' µs ' + Math.floor(incomingTI.remaining_usec / 1000 / 1000) + ' s '
            + Math.floor(((incomingTI.bytes_expected - incomingTI.bytes_written) / 1024) / (incomingTI.calculated_rate_kbps / 8)) + ' sec_calc '
            + '\n' + Math.floor(incomingTI.bytes_written / 1024) + ' kB_done ' + Math.floor(incomingTI.bytes_expected / 1024) + ' kB_exp '
            + Math.floor((incomingTI.bytes_expected - incomingTI.bytes_written) / 1024) + ' kB_todo '
            + '\nstart: ' + incomingTI.start_time + ' end: ' + incomingTI.end_time
          );

          const index = this.allTransfersList.findIndex(ti => ti.uuid === incomingTI.uuid);
          if (index === -1) {
            if (incomingTI.status !== 'removed') { this.allTransfersList.push(incomingTI); }
          } else {
            this.allTransfersList[index] = incomingTI;
            if (incomingTI.status === 'removed') { this.allTransfersList.splice(index, 1); }
          }
        });

        this.runningTransfers = 0;
        this.allTransfersList.forEach(ti => {
          /* this.log.debug(
            'AllTransferStatus: %s %s %s %s% %s kbps', ti.title, ti.uuid, ti.status, (ti.percentage * 100).toFixed(1), ti.calculated_rate_kbps
          ) */
          if (ti.status === 'running') { this.runningTransfers++; }
        });
      }
    });

    const appId = this.asperaWeb.initSession();
    this.log.debug('Connect init AppID: ', appId);
    this.asperaWeb.version({
      success: (data => this.log.info('Connect version: ', data)),
      error: (err => this.log.error('connect.version CB ERROR: ', err.error))
    });

    let dragDropEventTypeLast: string;

    this.asperaWeb.setDragDropTargets(
      '#dragdroparea',
      { dragEnter: false, dragLeave: true, dragOver: true, drop: true },
      dragDropObject => {
        if (!this.isConnected) { return; }
        if (dragDropObject.event.type !== dragDropEventTypeLast) {
          this.log.debug('DragDrop Event: ', dragDropObject.event.type);
          dragDropEventTypeLast = dragDropObject.event.type;

          switch (dragDropObject.event.type) {
            case 'dragover':
              this.isDragOver = true;
              this.log.debug('DragDrop addClass .dragging-over-grid');
              break;
            case 'dragleave':
              this.isDragOver = false;
              this.log.debug('DragDrop removeClass .dragging-over-grid');
              break;
            case 'drop':
              this.isDragOver = false;
              this.log.debug('DragDrop removeClass .dragging-over-grid');
              this.log.debug('DragDrop Object: ', dragDropObject);
              this.uploadFiles(dragDropObject.files);
              break;
          }
        }
      }
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      this.log.debug('URLparams (observable): ', params);
      if (params.goto && this.config.enableGoto) {
        let gotoCred: any;
        try {
          const b64 = this.z.reverseObfuscation(params.goto);
          gotoCred = this.z.inflateJson(b64);
        } catch (e) { console.error('error setting "nodeAPIcred" from goto URL parameter ERROR: ', e); }
        if (gotoCred != null) {
          this.log.info('setting cred from goto json: ', gotoCred);
          this.uiCred.useTokenAuth = true;
          Object.keys(this.uiCred).forEach(k => {
            if (typeof this.uiCred[k] === typeof gotoCred[k]) { this.uiCred[k] = gotoCred[k]; }
          });
        }

        this.log.debug('new NodeAPI cred from goto json: : ', this.uiCred);
        // this.testconnection(); // this also saves the uiCred to localstorage if enabled
        this.nodeAPI.setCred(this.uiCred);
        this.browse('/');
      }

    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // transfer activity methods
  stopTransfer(uuid: string) {
    this.log.info('Connect stopTransfer: ', uuid);
    this.asperaWeb.stopTransfer(uuid, { error: (err => this.log.error('connect.stopTransfer CB ERROR: ', err.error)) });
  }

  stopAllTransfers() {
    this.log.info('Connect stopAllTransfers!');
    this.allTransfersList.forEach(ti => {
      if (ti.status === 'running') { this.stopTransfer(ti.uuid); }
    });
  }

  resumeTransfer(uuid: string) {
    this.log.info('Connect resumeTransfer: ', uuid);
    this.asperaWeb.resumeTransfer(uuid, { error: (err => this.log.error('connect.resumeTransfer CB ERROR: ', err.error)) });
  }

  resumeAllTransfers() {
    this.log.info('Connect resumeAllTransfers!');
    this.allTransfersList.forEach(ti => {
      if (ti.status !== 'completed') { this.resumeTransfer(ti.uuid); }
    });
  }

  removeTransfer(uuid: string) {
    this.log.info('Connect removeTransfer: ', uuid);
    this.asperaWeb.removeTransfer(uuid, { error: (err => this.log.error('connect.removeTransfer CB ERROR: ', err.error)) });
  }

  clearInactiveTransfers() {
    this.log.info('Connect clearInactiveTransfers!');
    this.allTransfersList.forEach(ti => {
      if (ti.status !== 'running') { this.removeTransfer(ti.uuid); }
    });
  }

  showTransferMonitor(uuid: string) {
    this.log.info('Connect showTransferMonitor: ', uuid);
    this.asperaWeb.showTransferMonitor(uuid, { error: (err => this.log.error('connect.showTransferMonitor CB ERROR: ', err.error)) });
  }

  showTransferManager() {
    this.log.info('Connect showTransferManager!');
    this.asperaWeb.showTransferManager({ error: (err => this.log.error('connect.showTransferManager CB ERROR: ', err.error)) });
  }


  // table header methods
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    this.updateSelectedTotals();
  }

  itemToggle(item) {
    this.selection.toggle(item);
    this.updateSelectedTotals();
  }

  updateSelectedTotals() {
    this.totalBytes = this.selection.selected.map(i => i.size).reduce((acc, cur) => acc + cur, 0);
    this.totalFiles = this.selection.selected.filter(i => i.type === 'file').length;
    this.totalDirs = this.selection.selected.filter(i => i.type === 'directory').length;
    this.log.debug(
      'Selected Total: ', this.selection.selected.length, ' File:', this.totalFiles, ' Bytes: ', this.totalBytes, ' Dirs: ', this.totalDirs
    );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // settings sidenav methods
  testconnection() {
    this.log.debug('--> action test');
    this.uiCred.nodeURL = this.uiCred.nodeURL.trim().replace(/\/+$/, '');
    this.uiCred.nodeUser = this.uiCred.nodeUser.trim();
    this.uiCred.nodePW = this.uiCred.nodePW.trim();
    (this.config.enableCredLocalStorage) ? this.nodeAPI.saveCred(this.uiCred) : this.nodeAPI.setCred(this.uiCred);

    this.browseInProgress = true;
    this.nodeAPI.info()
      .subscribe(
        (info: any) => {
          this.browseInProgress = false;
          this.HTTPerror = undefined;
          this.APIerror = undefined;
          this.log.info('get info result json: ', info);
          this.isConnected = true;
          this.browse('/');
        },
        (err) => {
          this.browseInProgress = false;
          this.HTTPerror = err;
          this.log.error(' nodeAPI info ERROR: ', err);
          this.isConnected = false;
        }
      );
  }

  //  card title & button methods
  getNodeHostname() {
    // return this.uiCred.nodeURL
    return (this.uiCred.nodeURL.includes('localhost')) ? location.origin : this.uiCred.nodeURL;
  }

  browse(path: string) {
    this.log.debug('--> action browse');
    this.selection = new SelectionModel<any>(true, []);

    this.browseInProgress = true;
    this.nodeAPI.browse(path)
      .subscribe(
        (dirList: DirList) => {
          this.browseInProgress = false;
          this.HTTPerror = undefined;
          this.APIerror = undefined;

          this.log.info('browse result dirList: ', dirList);
          if (dirList.self && dirList.self.path && dirList.items ) {
            this.isConnected = true;
            this.dirList = dirList;
            this.dataSource.data = dirList.items;
            this.breadcrumbNavs = this.breadcrumb(dirList.self.path);
          } else {
            const err = 'API call returned wrong / unexpected data';
            this.APIerror = err;
            this.log.error('nodeAPI browse ERROR: ', err);
            this.log.error('nodeAPI browse ERROR: ', dirList);
          }
        },
        (err) => {
          this.browseInProgress = false;
          this.HTTPerror = err;
          this.log.error('nodeAPI browse ERROR: ', err);
        }
      );
  }

  download() {
    this.log.debug('--> action download');
    this.log.debug('List selection: ', this.selection);
    const paths = this.selection.selected.map(item => ({ source: item.path }));
    this.log.info('download paths: ', paths);

    this.nodeAPI.download_setup(paths)
      .subscribe(
        (transferSpecs) => {
          this.log.debug('download_setup result transferSpecs: ', transferSpecs);
          this.startTransfer(transferSpecs);
        },
        (err) => {
          this.HTTPerror = err;
          this.log.error('nodeAPI download_setup ERROR: ', err);
        }
      );
  }

  startTransfer(transferSpecs) {
    this.HTTPerror = undefined;
    this.APIerror = undefined;
    if (transferSpecs.transfer_specs && transferSpecs.transfer_specs[0]) {
      const transferSpec = transferSpecs.transfer_specs[0].transfer_spec;
      if (this.uiCred.useTokenAuth) {
        transferSpec.authentication = 'token';
        this.connectSettings.allow_dialogs = false;
      } else {
        this.connectSettings.allow_dialogs = true;
      }
      this.log.info('startTransfer transferSpec: ', transferSpec);
      this.log.debug('startTransfer connectSettings: ', this.connectSettings);
      this.asperaWeb.startTransfer(transferSpec, this.connectSettings,
        {
          success: (obj => this.log.debug('startTransfer CB: ', obj)),
          error: (err => this.log.error('startTransfer CB ERROR: ', err.error))
        });
      this.showConnectSnackBar();
    } else {
      const err = 'nodeAPI *load_setup - API call returned wrong / unexpected data';
      this.APIerror = err;
      this.log.error('nodeAPI *load_setup ERROR: : ', err);
      this.log.error('nodeAPI *load_setup:  ', transferSpecs);
    }
  }

  deleteDialog() {
    const dialogRef =
      this.dialog.open(DeleteConfDialogComponent, { width: '250px', data: { nr: this.selection.selected.length } });

    dialogRef.afterClosed()
      .subscribe(
        res => {
          this.log.info('Delete Dialog: ', res);
          if (res) { this.delete(); }
        }
      );
  }
  delete() {
    this.log.debug('--> action delete');
    this.log.debug('List selection: ', this.selection);
    const paths = this.selection.selected.map(item => ({ path: item.path }));
    this.log.info('delete paths: ', paths);

    this.nodeAPI.delete(paths)
      .subscribe(
        (res) => {
          this.HTTPerror = undefined;
          this.APIerror = undefined;
          this.log.info('delete result : ', res);
          this.browse(this.dirList.self.path);
        },
        (err) => {
          this.HTTPerror = err;
          this.log.error('nodeAPI delete ERROR: ', err);
        }
      );
  }

  createDirDialog() {
    let dirname = '';
    const dialogRef =
      this.dialog.open(CreateDirDialogComponent, { width: '250px', data: { name: dirname } });

    dialogRef.afterClosed()
      .subscribe(
        res => {
          this.log.debug('New Folder Dialog name: ', dirname);
          if (res) { dirname = res.trim(); }
          if (dirname !== '') { this.createDir(dirname); }
        }
      );
  }
  createDir(name: string) {
    this.log.debug('--> action create');
    const newDirPath = this.dirList.self.path + '/' + name;
    this.log.info('create Dir path: ', newDirPath);

    this.nodeAPI.createDir(newDirPath)
      .subscribe(
        (res) => {
          this.HTTPerror = undefined;
          this.APIerror = undefined;
          this.log.info('create Dir result : ', res);
          this.browse(newDirPath);
        },
        (err) => {
          this.HTTPerror = err;
          this.log.error('nodeAPI create ERROR: ', err);
        }
      );
  }

  showSelectFileDialog() {
    this.asperaWeb.showSelectFileDialog({
      success: (data => this.uploadFiles(data)),
      error: (err => this.log.error('showSelectFileDialog CB ERROR: ', err.error))
    });
  }
  showSelectFolderDialog() {
    this.asperaWeb.showSelectFolderDialog({
      success: (data => this.uploadFiles(data)),
      error: (err => this.log.error('showSelectFolderDialog CB ERROR: ', err.error))
    });
  }
  uploadFiles(data) {
    this.log.debug('--> action upload');
    this.log.debug('uploadFiles data: ', data);
    if (data.dataTransfer.files.length === 0) { return; }

    const paths = data.dataTransfer.files.map(file => ({ source: file.name }));
    this.log.info('uploadFiles paths: ', paths);

    this.nodeAPI.upload_setup(paths, this.dirList.self.path)
      .subscribe(
        (transferSpecs) => {
          this.log.debug('upload_setup result transferSpecs: ', transferSpecs);
          this.startTransfer(transferSpecs);
        },
        (err) => {
          this.HTTPerror = err;
          this.log.error('nodeAPI upload_setup ERROR: ', err);
        }
      );

  }

  breadcrumb(path: string): Array<BreadcrumbNav> {
    const dirnames = path.split('/');
    let partPath = '';
    const list = [];

    for (let i = 1; i < dirnames.length; i++) {
      partPath += '/' + dirnames[i];
      list.push({ dirname: dirnames[i], path: partPath });
    }
    this.log.debug('dir name path list: ', list);
    return list;
  }

  showConnectSnackBar() {
    this._snackBar.open('Aspera Connect started', '', { duration: 3000 });
  }

}
