import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

// declare var pako: any;
import * as pako from 'pako';

@Injectable()
export class ZlibB64 {

  b64toJson(b64: string): object {
    const jsonstr = atob(b64);
    return JSON.parse(jsonstr);
  }

  jsontob64(json: object): string {
    const jsonstr = JSON.stringify(json);
    return btoa(jsonstr);
  }

  inflateB64(b64z: string): string {
    const z = atob(b64z);
    return pako.inflate(z, { to: 'string' });
  }

  deflateB64(str: string): string {
    const z = pako.deflate(str, { to: 'string' });
    return btoa(z);
  }

  inflateJson(b64z: string): object {
    const jsonstr = this.inflateB64(b64z);
    return JSON.parse(jsonstr);
  }

  deflateJson(json: object): string {
    const jsonstr = JSON.stringify(json);
    return this.deflateB64(jsonstr);
  }

  reverseObfuscation(str: string): string {
    const rev = str.split('').reverse().join('');
    // var repl = rev.replace(/[\-_]/g, m => {return {'-': '+','_': '/'}[m] });
    const b64 = rev.replace(/-/g, '+').replace(/_/g, '/');
    return b64;
  }

  obfuscation(b64: string): string {
    const str = b64.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    const rev = str.split('').reverse().join('');
    return rev;
  }

}

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [ZlibB64],
})
export class ZlibB64Module { }
