import { Component } from '@angular/core';

import { AsperaNodeApiService } from './services/aspera-node-api.service';

declare var AW4: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  asperaWeb: any;
  dir_ls: any;

  constructor(private nodeAPI: AsperaNodeApiService) {

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

  downloadFile() {
    const transferSpec = {
      paths: [{ 'source': 'aspera-test-dir-large/100MB' }],
      remote_host: 'demo.asperasoft.com',
      remote_user: 'aspera',
      remote_password: 'demoaspera',
      direction: 'receive',
      target_rate_kbps: 15000,
      allow_dialogs: true,
      resume: 'sparse_checksum'
    };

    const connectSettings = {
      allow_dialogs: 'yes'
    };

    console.log('downloadFile ', transferSpec);
    this.asperaWeb.startTransfer(transferSpec, connectSettings);
  }

  showSelectFileDialog() {
    this.asperaWeb.showSelectFileDialog({ success: this.uploadFiles.bind(this) })
  }

  uploadFiles(cbObj) {
    console.log('uploadFiles ', cbObj);
    const transferSpec = {
      paths: [],
      remote_host: "demo.asperasoft.com",
      remote_user: "aspera",
      remote_password: "demoaspera",
      direction: "send",
      target_rate_kbps: 15000,
      resume: "sparse_checksum",
      destination_root: "/Upload"
    };

    transferSpec.paths = cbObj.dataTransfer.files.map(file => { return { source: file.name } });

    if (transferSpec.paths.length === 0)  return;
    
    const connectSettings = {
      allow_dialogs: 'yes'
    };

    console.log('uploadFiles transferSpec', transferSpec);
    this.asperaWeb.startTransfer(transferSpec, connectSettings);
  };


  handleTransferEvents(event, obj) {
    switch (event) {
      case 'transfer':
        // console.log(obj);
        break;
    }
  };

  browse() {
    this.nodeAPI.browse('/Upload')
      .subscribe(
      dir_ls => {
        this.dir_ls = dir_ls;
        console.log(dir_ls);
      },
      (err) => {
        console.error("ERROR: nodeAPI browse");
        console.error(err);
      }
      );
  }


}
