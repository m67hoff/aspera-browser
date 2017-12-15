import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AsperaNodeApiService {

  constructor(private http: HttpClient) {
  }
  nodeAPIcred_demo = {
    nodeURL: 'https://demo.asperasoft.com:9092',
    nodeUser: 'asperaweb',
    nodePW: 'demoaspera'
  };

  nodeAPIcred_demo_se = {
    nodeURL: 'https://demo.asperasoft.com:9092',
    nodeUser: 'asperademo-se',
    nodePW: 'xxxxx'
  };

  nodeAPIcred_ES1 = {
    nodeURL: 'https://192.168.80.101:9092',
    nodeUser: 'node_faspex',
    nodePW: 'xxxxx'
  };

  nodeAPIcred = this.nodeAPIcred_demo;

  headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    .append('Access-Control-Allow-Origin', '*')
    .append('Authorization', 'Basic ' + btoa(this.nodeAPIcred.nodeUser + ':' + this.nodeAPIcred.nodePW));


  browse(path: string): Observable<DirList> {
    const url = this.nodeAPIcred.nodeURL + '/files/browse';
    const data = { path: path };

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

}

export interface DirList {
  items: Array<Object>;
  self: Object;
  total_count: number;
}
