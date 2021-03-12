import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Logger } from '../logger/logger.module';

@Injectable()
export class AsperaNodeApiService {

  constructor(
    private http: HttpClient,
    private log: Logger,
  ) { }

  private nodeAPIcred: NodeAPIcred = {
    nodeURL: 'https://demo.asperasoft.com:9092',
    nodeUser: 'aspera',
    nodePW: 'demoaspera',
    useTokenAuth: false
  };

  private APIconnectProxy = 'direct';  // angular http client connect to middle server or direct
  private nodeURL: string;

  private headers = new HttpHeaders()
    .append('Content-Type', 'application/json');

  private _setProp() {
    this.headers = this.headers.set('Authorization', 'Basic ' + btoa(this.nodeAPIcred.nodeUser + ':' + this.nodeAPIcred.nodePW));

    if (this.APIconnectProxy === 'direct') {
      this.nodeURL = this.nodeAPIcred.nodeURL;
      this.headers = this.headers.delete('nodeURL');
    } else {
      this.nodeURL = this.APIconnectProxy;
      this.headers = this.headers.set('nodeURL', this.nodeAPIcred.nodeURL);
    }
    this.log.debug('_setProp header Auth: ', this.headers.getAll('Authorization'));
    this.log.debug('_setProp header nodeURL: ', this.headers.getAll('nodeURL'));
    this.log.debug('_setProp _nodeURL: ', this.nodeURL);
  }

  getAPIconnectProxy() { return this.APIconnectProxy; }
  setAPIconnectProxy(p: string) {
    this.log.debug('setAPIconnectProxy: ', p);
    this.APIconnectProxy = p; //  '' | 'direct' | 'http://...'
    this._setProp();
  }

  getCred(): NodeAPIcred { return this.nodeAPIcred; }
  setCred(cred: NodeAPIcred) {
    this.log.debug('setCred json: ', cred);
    this.nodeAPIcred = cred;
    this._setProp();
  }

  loadCred(): NodeAPIcred {
    let storedCred: any;
    try {
      storedCred = JSON.parse(localStorage.getItem('nodeAPIcred'));
    } catch (e) { console.error('error loading localstorage "nodeAPIcred" error: ', e); }
    this.log.debug('loadCred localstorage json: ', storedCred);
    if (storedCred != null) {
      if (storedCred.nodeURL) { this.nodeAPIcred.nodeURL = storedCred.nodeURL; }
      if (storedCred.nodeUser) { this.nodeAPIcred.nodeUser = storedCred.nodeUser; }
      if (storedCred.nodePW) { this.nodeAPIcred.nodePW = atob(storedCred.nodePW); }
      if (storedCred.useTokenAuth) { this.nodeAPIcred.useTokenAuth = storedCred.useTokenAuth; }
    }
    this.log.debug('loadCred loaded json: ', this.nodeAPIcred);
    this._setProp();
    return this.nodeAPIcred;
  }

  saveCred(cred?: NodeAPIcred) {
    if (cred !== undefined) { this.setCred(cred); }
    const storedCred = {
      nodeURL: this.nodeAPIcred.nodeURL,
      nodeUser: this.nodeAPIcred.nodeUser,
      nodePW: btoa(this.nodeAPIcred.nodePW),
      useTokenAuth: this.nodeAPIcred.useTokenAuth
    };
    this.log.info('saveCred json: ', storedCred);
    localStorage.setItem('nodeAPIcred', JSON.stringify(storedCred));
  }

  info(): Observable<object> {
    const url = this.nodeURL + '/info';
    this.log.info('URL: ', url);
    this.log.debug('nodeAPIcred: ', this.nodeAPIcred);
    this.log.debug('headers: ', atob(this.headers.get('Authorization').substring(5)));
    return this.http
      .get(url, { headers: this.headers });
  }

  browse(path: string): Observable<DirList> {
    const url = this.nodeURL + '/files/browse';
    const data = { path, count: 1000 };

    this.log.info('URL: ', url);
    this.log.debug('headers: ', this.headers);
    this.log.info('postdata: ', data);

    return this.http
      .post<DirList>(url, data, { headers: this.headers });
  }

  download_setup(paths: Array<object>): Observable<any> {
    const url = this.nodeURL + '/files/download_setup';
    const data = {
      transfer_requests:
        [
          { transfer_request: { paths } }
        ]
    };

    this.log.info('URL: ', url);
    this.log.debug('headers: ', this.headers);
    this.log.info('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this.headers });
  }

  upload_setup(paths: Array<object>, destination: string): Observable<any> {
    const url = this.nodeURL + '/files/upload_setup';
    const data = {
      transfer_requests:
        [
          {
            transfer_request: {
              paths,
              destination_root: destination
            }
          }
        ]
    };

    this.log.info('URL: ', url);
    this.log.debug('headers: ', this.headers);
    this.log.info('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this.headers });
  }

  delete(paths: Array<object>): Observable<any> {
    const url = this.nodeURL + '/files/delete';
    const data = { paths };

    this.log.info('URL: ', url);
    this.log.debug('headers: ', this.headers);
    this.log.info('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this.headers });
  }

  createDir(path: string): Observable<any> {
    const url = this.nodeURL + '/files/create';
    const data = {
      paths: [
        { path, type: 'directory' }
      ]
    };

    this.log.info('URL: ', url);
    this.log.debug('headers: ', this.headers);
    this.log.info('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this.headers });
  }

} // class AsperaNodeApiService

export interface DirList {
  items: Array<object>;
  self: {
    path: string
    permissions: Array<object>,
  };
  total_count: number;
}

export interface NodeAPIcred {
  nodeURL: string;
  nodeUser: string;
  nodePW: string;
  useTokenAuth: boolean;
}
