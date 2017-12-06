import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  baseURL = 'http://localhost:1880';

  /* constructor() {
    const CONNECT_INSTALLER =  "//d3gcli72yxqn2z.cloudfront.net/connect/v4";
    this.asperaWeb = new AW4.Connect({sdkLocation: CONNECT_INSTALLER, minVersion: "3.6.0"});
    var asperaInstaller = new AW4.ConnectInstaller({sdkLocation: CONNECT_INSTALLER});
    var statusEventListener = function (eventType, data) {
      if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.INITIALIZING) {
        asperaInstaller.showLaunching();
     } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.FAILED) {
       asperaInstaller.showDownload();
     } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.OUTDATED) {
       asperaInstaller.showUpdate();
     } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.RUNNING) {
       asperaInstaller.connected();
     }
    };
    asperaWeb.addEventListener(AW4.Connect.EVENT.STATUS, statusEventListener);
    asperaWeb.initSession();
  }
 */
}
