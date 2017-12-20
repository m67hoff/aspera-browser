import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AsperaNodeApiService {

  constructor(private http: HttpClient) {
  }

  nodeAPIcred: NodeAPIcred = {
    nodeURL: 'https://demo.asperasoft.com:9092',
    nodeUser: 'asperaweb',
    nodePW: 'demoaspera'
  };

  headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Authorization', 'Basic ' + btoa(this.nodeAPIcred.nodeUser + ':' + this.nodeAPIcred.nodePW));


  setCred(nodeAPIcred: NodeAPIcred) {
    this.nodeAPIcred = nodeAPIcred;
    this.headers = this.headers.set('Authorization', 'Basic ' + btoa(nodeAPIcred.nodeUser + ':' + nodeAPIcred.nodePW));
  }
  getCred() { return this.nodeAPIcred; }

  info(): Observable<Object> {
    const url = this.nodeAPIcred.nodeURL + '/info';
    console.log('URL: ', url);
    // console.log('nodeAPIcred: ', this.nodeAPIcred);
    // console.log('headers: ', atob(this.headers.get('Authorization').substring(5)));
    return this.http
      .get(url, { headers: this.headers });
  }

  browse(path: string): Observable<DirList> {
    const url = this.nodeAPIcred.nodeURL + '/files/browse';
    const data = { path: path, count: 1000 };

    console.log('URL: ', url);
    // console.log('headers: ', this.headers);
    console.log('postdata: ', data);

    return this.http
      .post<DirList>(url, data, { headers: this.headers });
  }

  download_setup(paths: Array<Object>): Observable<any> {
    const url = this.nodeAPIcred.nodeURL + '/files/download_setup';
    const data = {
      transfer_requests:
        [
          { transfer_request: { paths: paths } }
        ]
    };

    console.log('URL: ', url);
    // console.log('headers: ', this.headers);
    console.log('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this.headers });
  }

  upload_setup(paths: Array<Object>, destination: string): Observable<any> {
    const url = this.nodeAPIcred.nodeURL + '/files/upload_setup';
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

    console.log('URL: ', url);
    // console.log('headers: ', this.headers);
    console.log('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this.headers });
  }

  delete(paths: Array<Object>): Observable<any> {
    const url = this.nodeAPIcred.nodeURL + '/files/delete';
    const data = { paths: paths };

    console.log('URL: ', url);
    // console.log('headers: ', this.headers);
    console.log('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this.headers });
  }

  createDir(path: string): Observable<any> {
    const url = this.nodeAPIcred.nodeURL + '/files/create';
    const data = {
      paths: [
        { path: path, type: 'directory' }
      ]
    };

    console.log('URL: ', url);
    // console.log('headers: ', this.headers);
    console.log('postdata: ', data);

    return this.http
      .post<any>(url, data, { headers: this.headers });
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
}
