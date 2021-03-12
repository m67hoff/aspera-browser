![](/doc/img/aspera.png)
## AsperaBrowser -  Angular SPA for Aspera Connect & Node API  
[![Dependencies Status](https://david-dm.org/m67hoff/aspera-browser.svg)](https://david-dm.org/m67hoff/aspera-browser)

Angular App using Aspera Connect API and Node API for file and folder upload & download, using Angular Material components.

(:exclamation: At the moment this is just a personal project, to get familiar with the Aspera APIs and technology, and not an "official" open source project from IBM / Aspera)

### See it live:
A sample is deployed on IBM Cloud:
[asperabrowser.mybluemix.net](https://asperabrowser.mybluemix.net)
(This sample is preconfigured with a login to the Aspera Demoserver. Just click login)

#### Features:
- modern, fast & intuitive to use WebUI
- browse, upload, download to any Aspera Transfer Server or ATS/Folder Access-Key - local or remote
- drag-and-drop to upload
- see and manage your transfer activity
- "goto" feature to start from [aspera-cli](https://github.com/IBM/aspera-cli)
- cloud or on-prem
- separate or on same system as Transfer Server
- support for HTTPS 
- runs everywhere: Linux, Mac, Windows (node.js)   
- Docker Image available  
- highly configurable
- just uses Aspera Connect and NodeAPI
- can host connect and all libs to run in internal networks
- Angular SPA can also run separate from the node.js server
- opensource

### For more Information how to use/install it on your own system see the  
### [AsperaBrowser Handbook](https://github.com/m67hoff/aspera-browser/wiki) 

### Todo / planned / ideas 
- run on Openshift 
- support also ascmd (in addition to nodeApi)
- replace request dependency in node.js (deprecated)
- run as windows service   
- Docs & more Docs
- more error handling
- user Help
- unittests & e2e 
- admin ui for node.js server to set config 
- sharing via access keys  (as suggested by Laurent)  

### Screenshot 
![](/doc/img/browse.jpg)