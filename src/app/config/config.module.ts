import { NgModule, Injectable, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

const CONFIGFILE = 'assets/config.json';

@Injectable()
export class Config {

  [key: string]: any   // trick to define types for dynamic key:value properties

  constructor(private http: HttpClient) { }

  loadConfFile(): Promise<any> {
    const promise = this.http.get(CONFIGFILE)
      .toPromise()
      .then((config: any) => {
        this._addAsProperty(config.app);
        if (config.config.enableLocalClientConfig) { this._updateFromLocalStorage(config.config.localClientConfigKeys); }
      })
      .catch(e => console.error('error loading config file: %s error: ', CONFIGFILE, e));
    return promise;
  }

  private _addAsProperty(data: object) {
    Object.entries(data).forEach(
      ([key, value]) => {
        this[key] = value;
      });
  }
  private _updateFromLocalStorage(arr: Array<string>) {
    arr.forEach(key => {
      try {
        const storedItem = JSON.parse(localStorage.getItem(key));
        if (storedItem != null) { this[key] = storedItem; }
      } catch (e) { console.error('error loading localstorage config key: %s error: ', key, e); }
      localStorage.setItem(key, JSON.stringify(this[key]));
    });
  }

}

export function initConfig(config: Config) {
  return () => config.loadConfFile();
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    Config,
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [Config], multi: true }
  ],
})
export class ConfigModule { }




