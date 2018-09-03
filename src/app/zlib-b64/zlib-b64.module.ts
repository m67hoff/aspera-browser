import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var pako: any;

@Injectable()
export class ZlibB64 {

  b64toJson(b64: string): object {
    let jsonstr = atob(b64);
    return JSON.parse(jsonstr);
  }

  jsontob64(json: object): string {
    let jsonstr = JSON.stringify(json);
    return btoa(jsonstr)
  }

  inflateB64(b64z: string): string {
    let z = atob(b64z)
    return pako.inflate(z, { to: 'string' });
  }

  deflateB64(str: string): string {
    let z = pako.deflate(str, { to: 'string' })
    return btoa(z);
  }

  inflateJson(b64z: string): object {
    let jsonstr = this.inflateB64(b64z)
    return JSON.parse(jsonstr);
  }

  deflateJson(json: object): string {
    let jsonstr = JSON.stringify(json)
    return this.deflateB64(jsonstr);
  }
  
  reverseObfuscation(str: string): string {
    let rev = str.split("").reverse().join("")
    // var repl = rev.replace(/[\-_]/g, m => {return {'-': '+','_': '/'}[m] });
    let b64 = rev.replace(/-/g, '+').replace(/_/g, '/')
    return b64
  }

  obfuscation(b64: string): string {
    let str = b64.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
    let rev = str.split("").reverse().join("")
    return rev
  }
  
}

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [ZlibB64],
})
export class ZlibB64Module { }
