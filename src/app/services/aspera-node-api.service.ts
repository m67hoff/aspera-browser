import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LoggerService } from './logger.service';

@Injectable()
export class AsperaNodeApiService {

  constructor(
    private http: HttpClient,
    private log: LoggerService
  ) {
    this.loadCred();
  }

  private _nodeAPIcred: NodeAPIcred = {
    nodeURL: 'https://demo.asperasoft.com:9092',
    nodeUser: 'asperaweb',
    nodePW: 'demoaspera',
    useTokenAuth: false
  };

  private _APIconnectProxy = 'direct';  // angular http client connect to middle server or direct
  private _nodeURL: string;

  private _headers = new HttpHeaders()
    .append('Content-Type', 'application/json');

  private _setProp() {
    this._headers = this._headers.set('Authorization', 'Basic ' + btoa(this._nodeAPIcred.nodeUser + ':' + this._nodeAPIcred.nodePW));

    if (this._APIconnectProxy === 'direct') {
      this._nodeURL = this._nodeAPIcred.nodeURL;
      this._headers = this._headers.delete('nodeURL');
    } else {
      this._nodeURL = this._APIconnectProxy;
      this._headers = this._headers.set('nodeURL', this._nodeAPIcred.nodeURL);
    }
    this.log.debug('_setProp header Auth: ', this._headers.getAll('Authorization'));
    this.log.debug('_setProp header nodeURL: ', this._headers.getAll('nodeURL'));
    this.log.debug('_setProp _nodeURL: ', this._nodeURL);
  }

  getAPIconnectProxy() { return this._APIconnectProxy; }
  setAPIconnectProxy(p: string) {
    this.log.debug('setAPIconnectProxy: ', p);
    this._APIconnectProxy = p; //  '' | 'direct' | 'http://...'
    this._setProp();
  }

  getCred(): NodeAPIcred { return this._nodeAPIcred; }
  setCred(cred: NodeAPIcred) {
    this.log.debug('setCred json: ', cred);
    this._nodeAPIcred = cred;
    this._setProp();
  }

  loadCred(): NodeAPIcred {
    const storedCred = JSON.parse(localStorage.getItem('nodeAPIcred'));
    this.log.debug('loadCred json: ', storedCred);
    if (storedCred != null) {
      this._nodeAPIcred = {
        nodeURL: storedCred.nodeURL,
        nodeUser: storedCred.nodeUser,
        nodePW: atob(storedCred.nodePW),
        useTokenAuth: storedCred.useTokenAuth
      };
    }
    this.log.debug('loadCred json: ', this._nodeAPIcred);
    this._setProp();
    return this._nodeAPIcred;
  }

  saveCred(cred?: NodeAPIcred) {
    if (cred !== undefined) { this.setCred(cred); }
    const storedCred = {
      nodeURL: this._nodeAPIcred.nodeURL,
      nodeUser: this._nodeAPIcred.nodeUser,
      nodePW: btoa(this._nodeAPIcred.nodePW),
      useTokenAuth: this._nodeAPIcred.useTokenAuth
    };
    this.log.info('saveCred json: ', storedCred);
    localStorage.setItem('nodeAPIcred', JSON.stringify(storedCred));
  }

  info(): Observable<Object> {
    const url = this._nodeURL + '/info';
    this.log.info('URL: ', url);
    this.log.debug('nodeAPIcred: ', this._nodeAPIcred);
    this.log.debug('headers: ', atob(this._headers.get('Authorization').substring(5)));
    return this.http
      .get(url, { headers: this._headers });
  }

  browse(path: string): Observable<DirList> {
    const url = this._nodeURL + '/files/browse';
    const data = { path: path, count: 1000 };

    this.log.info('URL: ', url);
    this.log.debug('headers: ', this._headers);
    this.log.info('postdata: ', data);

    return this.http
      .post<DirList>(url, data, { headers: this._headers });
  }

  download_setup(paths: Array<Object>): Observable<any> {
    const url = this._nodeURL + '/files/download_setup';
    const data = {
      transfer_requests:
        [
          { transfer_request: { paths: paths } }
        ]
    };

    this.log.info('URL: ', url);
    this.log.debug('headers: ', this._headers);
    this.log.info('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this._headers });
  }

  upload_setup(paths: Array<Object>, destination: string): Observable<any> {
    const url = this._nodeURL + '/files/upload_setup';
    const data = {
      transfer_requests:
        [
          {
            transfer_request: {
              paths: paths,
              destination_root: destination
            }
          }
        ]
    };

    this.log.info('URL: ', url);
    this.log.debug('headers: ', this._headers);
    this.log.info('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this._headers });
  }

  delete(paths: Array<Object>): Observable<any> {
    const url = this._nodeURL + '/files/delete';
    const data = { paths: paths };

    this.log.info('URL: ', url);
    this.log.debug('headers: ', this._headers);
    this.log.info('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this._headers });
  }

  createDir(path: string): Observable<any> {
    const url = this._nodeURL + '/files/create';
    const data = {
      paths: [
        { path: path, type: 'directory' }
      ]
    };

    this.log.info('URL: ', url);
    this.log.debug('headers: ', this._headers);
    this.log.info('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this._headers });
  }

} // class AsperaNodeApiService

export interface DirList {
  items: Array<Object>;
  self: {
    path: string
    permissions: Array<Object>,
  };
  total_count: number;
}

export interface NodeAPIcred {
  nodeURL: string;
  nodeUser: string;
  nodePW: string;
  useTokenAuth: boolean;
}
