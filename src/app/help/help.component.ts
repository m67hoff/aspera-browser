import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Logger } from '../logger/logger.module';

const HELPFILE = 'webapphelp.json';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private log: Logger
  ) { }

  links = [
    {
      url: 'https://github.com/m67hoff/aspera-browser',
      name: 'AsperaBrowser @ GitHub',
      detail: 'Source and Docu for this Application (for Developers & Admins)'
    }
  ];

  getHelp(): Observable<object> {
    const url = HELPFILE;
    this.log.info('get helpfile links URL: ', url);
    return this.http.get<object>(url);
  }

  ngOnInit() {
    this.getHelp().subscribe(
      (links: any) => {
        this.links = links;
        this.log.debug('get help result json: ', links);
      },
      (err) => {
        this.log.error(' getHelp info ERROR: ', err);
      }
    );
  }

}
