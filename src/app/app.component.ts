import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

// import { digest } from '@angular/compiler/src/i18n/serializers/xmb';

import { AsperaNodeApiService, DirList, NodeAPIcred } from './services/aspera-node-api.service';

declare var AW4: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  asperaWeb: any;
  connectSettings = {
    allow_dialogs: 'yes'
  };

  dirList: DirList;

  displayedColumns = ['select', 'type', 'name', 'size', 'mtime'];
  dataSource = new MatTableDataSource();
  selection: SelectionModel<any>;

  isConnected = false;
  browseInProgress = false;
  hidePW = true;

  nodeAPIcred: NodeAPIcred = {
    nodeURL: 'https://demo.asperasoft.com:9092',
    nodeUser: 'asperaweb',
    nodePW: 'demoaspera'
  };

  constructor(private nodeAPI: AsperaNodeApiService) { }

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

  testconnection() {
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
        this.dirList = dirList;
        this.dataSource.data = dirList.items;
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
        console.log('download_setup result transferSpecs: ', transferSpecs);

        const transferSpec = transferSpecs.transfer_specs[0].transfer_spec;
        console.log('download_setup result transferSpec: ', transferSpec);
        // transferSpec['authentication'] = 'token';

        this.asperaWeb.startTransfer(transferSpec, this.connectSettings);
      },
      (err) => {
        console.error('nodeAPI download_setup ERROR: ');
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
        console.log('upload_setup result transferSpecs: ', transferSpecs);

        const transferSpec = transferSpecs.transfer_specs[0].transfer_spec;
        console.log('upload_setup result transferSpec: ', transferSpec);
        // transferSpec['authentication'] = 'token';

        this.asperaWeb.startTransfer(transferSpec, this.connectSettings);
      },
      (err) => {
        console.error('nodeAPI upload_setup ERROR: ');
        console.error(err);
      }
      );

  }

}
