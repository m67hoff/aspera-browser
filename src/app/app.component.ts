import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { AsperaNodeApiService, DirList, NodeAPIcred } from './services/aspera-node-api.service';
import { CredLocalstoreService } from './services/cred-localstore.service';
import { CreateDirDialogComponent } from './dialog/create-dir-dialog.component';
import { DeleteConfDialogComponent } from './dialog/delete-conf-dialog.component';


declare var AW4: any;

interface BreadcrumbNav { dirname: string; path: string; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  asperaWeb: any;
  connectSettings = {
    allow_dialogs: 'yes'
  };

  nodeAPIcred: NodeAPIcred;
  dirList: DirList;
  breadcrumbNavs: Array<BreadcrumbNav>;

  displayedColumns = ['select', 'type', 'basename', 'size', 'mtime'];
  dataSource = new MatTableDataSource();
  selection: SelectionModel<any>;

  isConnected = false;
  useTokenAuth = true;
  browseInProgress = false;
  hidePW = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private nodeAPI: AsperaNodeApiService, private credStore: CredLocalstoreService, public dialog: MatDialog) {
    this.nodeAPIcred = credStore.getCred();
    this.nodeAPI.setCred(this.nodeAPIcred);
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit() {
    const CONNECT_INSTALLER = '//d3gcli72yxqn2z.cloudfront.net/connect/v4';
    const asperaInstaller = new AW4.ConnectInstaller({ sdkLocation: CONNECT_INSTALLER });
    const statusEventListener = function (eventType, data) {
      if (eventType === AW4.Connect.EVENT.STATUS && data === AW4.Connect.STATUS.INITIALIZING) {
        asperaInstaller.showLaunching();
      } else if (eventType === AW4.Connect.EVENT.STATUS && data === AW4.Connect.STATUS.FAILED) {
        asperaInstaller.showDownload();
      } else if (eventType === AW4.Connect.EVENT.STATUS && data === AW4.Connect.STATUS.OUTDATED) {
        asperaInstaller.showUpdate();
      } else if (eventType === AW4.Connect.EVENT.STATUS && data === AW4.Connect.STATUS.RUNNING) {
        asperaInstaller.connected();
      }
    };

    this.asperaWeb = new AW4.Connect({ sdkLocation: CONNECT_INSTALLER, minVersion: '3.6.0' });
    this.asperaWeb.addEventListener(AW4.Connect.EVENT.STATUS, statusEventListener);
    this.asperaWeb.initSession();
    this.asperaWeb.addEventListener('transfer', this.handleTransferEvents);
  }

  handleTransferEvents(event, obj) {
    switch (event) {
      case 'transfer':
        // console.log('transfer: ', obj);
        break;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  testconnection() {
    this.nodeAPIcred.nodeURL = this.nodeAPIcred.nodeURL.trim();
    this.nodeAPIcred.nodeUser = this.nodeAPIcred.nodeUser.trim();
    this.nodeAPIcred.nodePW = this.nodeAPIcred.nodePW.trim();
    this.credStore.setCred(this.nodeAPIcred);
    this.nodeAPI.setCred(this.nodeAPIcred);
    this.browseInProgress = true;
    this.nodeAPI.info()
      .subscribe(
      (info: any) => {
        this.browseInProgress = false;
        console.log('info result json: ', info);
        this.isConnected = true;
        this.browse('/');
      },
      (err) => {
        this.browseInProgress = false;
        console.error(' nodeAPI info ERROR: ');
        console.error(err);
        this.isConnected = false;
      }
      );
  }

  browse(path: string) {
    this.browseInProgress = true;
    this.selection = new SelectionModel<any>(true, []);

    this.nodeAPI.browse(path)
      .subscribe(
      (dirList: DirList) => {
        this.browseInProgress = false;
        this.isConnected = true;
        this.dirList = dirList;
        this.dataSource.data = dirList.items;
        this.breadcrumbNavs = this.breadcrumb(dirList.self.path);
        console.log('browse result dirList: ', dirList);
      },
      (err) => {
        this.browseInProgress = false;
        console.error(' nodeAPI browse ERROR: ');
        console.error(err);
      }
      );
  }

  download() {
    // console.log('List selection: ', this.selection);
    const paths = this.selection.selected.map(item => ({ source: item.path }));
    console.log('download paths: ', paths);

    this.nodeAPI.download_setup(paths)
      .subscribe(
      (transferSpecs) => {
        // console.log('download_setup result transferSpecs: ', transferSpecs);

        const transferSpec = transferSpecs.transfer_specs[0].transfer_spec;
        if (this.useTokenAuth) { transferSpec['authentication'] = 'token'; }

        console.log('download_setup result transferSpec: ', transferSpec);
        this.asperaWeb.startTransfer(transferSpec, this.connectSettings);
      },
      (err) => {
        console.error('nodeAPI download_setup ERROR: ');
        console.error(err);
      }
      );
  }

  deleteDialog() {
    const paths = this.selection.selected.map(item => ({ path: item.path }));
    const dialogRef =
      this.dialog.open(DeleteConfDialogComponent, { width: '250px', data: { nr: paths.length } });

    dialogRef.afterClosed()
      .subscribe(
      res => {
        console.log('Delete Dialog: ', res);
        if (res) { this.delete(); }
      }
      );
  }
  delete() {
    // console.log('List selection: ', this.selection);
    const paths = this.selection.selected.map(item => ({ path: item.path }));
    console.log('delete paths: ', paths);

    this.nodeAPI.delete(paths)
      .subscribe(
      (res) => {
        console.log('delete result : ', res);
        this.browse(this.dirList.self.path);
      },
      (err) => {
        console.error('nodeAPI delete ERROR: ');
        console.error(err);
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
        // console.log('New Folder Dialog name: ', dirname);
        if (res) { dirname = res.trim(); }
        if (dirname !== '') { this.createDir(dirname); }
      }
      );
  }
  createDir(name: string) {
    // console.log('List selection: ', this.selection);

    const newDirPath = this.dirList.self.path + '/' + name;
    console.log('create Dir path: ', newDirPath);

    this.nodeAPI.createDir(newDirPath)
      .subscribe(
      (res) => {
        console.log('create Dir result : ', res);
        this.browse(newDirPath);
      },
      (err) => {
        console.error('nodeAPI create ERROR: ');
        console.error(err);
      }
      );
  }

  showSelectFileDialog() {
    this.asperaWeb.showSelectFileDialog({ success: (data => this.uploadFiles(data)) });
  }
  showSelectFolderDialog() {
    this.asperaWeb.showSelectFolderDialog({ success: (data => this.uploadFiles(data)) });
  }
  uploadFiles(data) {
    // console.log('uploadFiles data: ', data);
    if (data.dataTransfer.files === 0) { return; }

    const paths = data.dataTransfer.files.map(file => ({ source: file.name }));
    console.log('uploadFiles paths: ', paths);

    this.nodeAPI.upload_setup(paths, this.dirList.self.path)
      .subscribe(
      (transferSpecs) => {
        // console.log('upload_setup result transferSpecs: ', transferSpecs);
        const transferSpec = transferSpecs.transfer_specs[0].transfer_spec;
        if (this.useTokenAuth) { transferSpec['authentication'] = 'token'; }

        console.log('upload_setup result transferSpec: ', transferSpec);
        this.asperaWeb.startTransfer(transferSpec, this.connectSettings);
      },
      (err) => {
        console.error('nodeAPI upload_setup ERROR: ');
        console.error(err);
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
    // console.log('dir name path list: ', list);
    return list;
  }

}
