import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Config } from '../config/config.module';

import { LogLevel } from './loglevels';

const noop = (): any => undefined;

@Injectable()
export class Logger {

  private curLogLevel: LogLevel;

  constructor(
    private config: Config
  ) {
    const level = +LogLevel[config.logLevel];
    this.curLogLevel = (level) ? level : LogLevel.WARN;
    this.log('LogLevel: ', LogLevel[this.curLogLevel]);
  }

  getLogLevel() { return this.curLogLevel; }
  setLogLevel(level: LogLevel) {
    this.curLogLevel = level;
    this.info('new LogLevel: ', LogLevel[level]);
  }

  get log() { return console.log.bind(console); }

  get error() {
    if (this.curLogLevel >= LogLevel.ERROR) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (this.curLogLevel >= LogLevel.WARN) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get info() {
    if (this.curLogLevel >= LogLevel.INFO) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get debug() {
    if (this.curLogLevel >= LogLevel.DEBUG) {
      return console.debug.bind(console);
    } else {
      return noop;
    }
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [Logger],
})
export class LoggerModule { }
