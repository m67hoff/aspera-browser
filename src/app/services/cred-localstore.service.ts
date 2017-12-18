import { Injectable } from '@angular/core';

import { NodeAPIcred } from './aspera-node-api.service';

@Injectable()
export class CredLocalstoreService {

  constructor() { }

  getCred(): NodeAPIcred {
    const storedCred = JSON.parse(localStorage.getItem('nodeAPIcred'));
    let cred: NodeAPIcred;

    if (storedCred == null) {
      // default server
      cred = {
        nodeURL: 'https://demo.asperasoft.com:9092',
        nodeUser: 'asperaweb',
        nodePW: 'demoaspera'
      };
    } else {
      cred = {
        nodeURL: storedCred.nodeURL,
        nodeUser: atob(storedCred.nodeUser),
        nodePW: atob(storedCred.nodePW)
      };
    }

    console.log('getCred json: ', cred);
    return cred;
  }

  setCred(cred: NodeAPIcred) {
    const storedCred = {
      nodeURL: cred.nodeURL,
      nodeUser: btoa(cred.nodeUser),
      nodePW: btoa(cred.nodePW)
    };
    console.log('setCred json: ', storedCred);
    localStorage.setItem('nodeAPIcred', JSON.stringify(storedCred));
  }

}
