import { Injectable } from '@angular/core';
import { Config } from '../config/config.module';

const noop = (): any => undefined;

export enum LogLevel {
  OFF, ERROR, WARN, INFO, DEBUG
}

@Injectable()
export class LoggerService {

  constructor(
    private config: Config
  ) {
    this._curLogLevel = config.LOGLEVEL;
  }

  private _curLogLevel = LogLevel.WARN;

  getLogLevel() { return this._curLogLevel; }
  setLogLevel(level: LogLevel) {
    this._curLogLevel = level;
    this.info('new LogLevel: ', LogLevel[level]);
  }

  get error() {
    if (this._curLogLevel >= LogLevel.ERROR) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (this._curLogLevel >= LogLevel.WARN) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get info() {
    if (this._curLogLevel >= LogLevel.INFO) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get debug() {
    if (this._curLogLevel >= LogLevel.DEBUG) {
      return console.debug.bind(console);
    } else {
      return noop;
    }
  }
}
