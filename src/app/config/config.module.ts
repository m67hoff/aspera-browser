import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogLevel } from '../logger/loglevels'


@Injectable()
export class Config {

  LOGLEVEL = LogLevel.DEBUG;
  APICONNECTPROXY = 'http://localhost:6002';
  ASKURL = false;
  ASKCONNECT = false;

  constructor() { }

}


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [Config],
})
export class ConfigModule { }




