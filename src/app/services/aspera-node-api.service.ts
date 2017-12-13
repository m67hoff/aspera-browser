import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class AsperaNodeApiService {

  constructor(private http: HttpClient) {
  }

  browse(path: string): Observable<Object> {

    const url = "https://demo.asperasoft.com:9092/files/browse";
    // const url = "https://demo.asperasoft.com:9092/ping";

    let data = { path: path };

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
      .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
      .append('Access-Control-Allow-Origin', '*')
      .append('Authorization', 'Basic ' + btoa('asperaweb:demoaspera'));

    console.log('URL:', url)
    console.log('headers:', headers)
    console.log('data:', data)

    return this.http
      .post(url, data, { headers: headers })

  }


}
