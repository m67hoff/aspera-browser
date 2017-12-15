import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { AsperaNodeApiService, DirList } from './services/aspera-node-api.service';
import { MatTableDataSource } from '@angular/material';
import { digest } from '@angular/compiler/src/i18n/serializers/xmb';

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

  browseInProgress = false;

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

  showSelectFileDialog() {
    this.asperaWeb.showSelectFileDialog({ success: (data => this.uploadFiles(data)) });
  }
  showSelectFolderDialog() {
    this.asperaWeb.showSelectFolderDialog({ success: (data => this.uploadFiles(data)) });
  }
  uploadFiles(data) {
    console.log('uploadFiles data: ', data);
    const transferSpec = {
      paths: [],
      remote_host: 'demo.asperasoft.com',
      remote_user: 'aspera',
      remote_password: 'demoaspera',
      direction: 'send',
      target_rate_kbps: 15000,
      resume: 'sparse_checksum',
      destination_root: '/Upload'
    };
    if (data.dataTransfer.files === 0) { return; }
    transferSpec.paths = data.dataTransfer.files.map(file => ({ source: file.name }));

    console.log('uploadFiles transferSpec: ', transferSpec);
    this.asperaWeb.startTransfer(transferSpec, this.connectSettings);
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
    console.log('List selection.selected: ', this.selection.selected);

    const paths = this.selection.selected.map(item => ({ source: item.path }));
    console.log('download paths: ', paths);

    this.nodeAPI.download_setup(paths)
      .subscribe(
      (transferSpecs) => {
        console.log('download_setup result transferSpecs: ', transferSpecs);

        const transferSpec = transferSpecs.transfer_specs[0].transfer_spec;
        transferSpec['authentication'] = 'token';
        console.log('download_setup result transferSpec: ', transferSpec);

        this.asperaWeb.startTransfer(transferSpec, this.connectSettings);
      },
      (err) => {
        console.error('nodeAPI download_setup ERROR: ');
        console.error(err);
      }
      );

  }

}
