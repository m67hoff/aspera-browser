![](doc/img/aspera.png)
## AsperaBrowser -  Angular SPA for Aspera Connect & Node API  

Angular App using Aspera Connect API and Node API for file and folder upload & download.
UI using Angular Material components.

(:exclamation: At the moment this is just a personal project for me to get familiar with the Aspera APIs and technology, and not an "official" open source project from IBM / Aspera)

#### Features:
- modern, fast & intuitive to use WebUI
- browse, upload, download to any Aspera Transfer Server or ATS/Folder Access-Key - local or remote
- drag-and-drop to upload
- see and manage your transfer activity
- "goto" feature together with aslmcli
- cloud or on-prem
- separate or on same system as Transfer Server
- support for HTTPS 
- runs everywhere: Linux, Mac, Windows (node.js)   
- Docker Image available  
- highly configurable
- just uses Aspera Connect and NodeAPI
- can host connet and all libs to run in internal networks
- Angular SPA can also run separate from the node.js server
- opensource

### See it live:
A sample is deployed on IBM Cloud:
[asperabrowser.mybluemix.net](https://asperabrowser.mybluemix.net)
(This sample is preconfigured with a login to the Aspera Demoserver. Just click login)

### use it on you own system / node.js server
AsperaBrowser can be provided by a node.js web server. See the [node.js-server directory](node.js-server) to use/install it on your own system.

### Build the AsperaBrowser Angular
This directory contains the sources for the Angular App. It can be deployed as static SPA (see [Installation Guide](doc/Installation_Guide.md))
To build the AsperaBrowser Angular App run `npm run build`.  This will create a new build in the `node.js-server/webapp/` directory that contains the static WebApp.   

[Architecture Overview](doc/Architecture.md) provides information on the application components and the used APIs. 

### Todo / planned / ideas 
- Docs & more Docs
- unittests & e2e 
- setting to load icon fonts local
- run as windows service   
- authorization integration for node.js server 
- sharing via access keys  (as suggested by Laurent)  
- more connect error Handling

### Screenshots 

##### Browse Directory:
![](doc/img/browse.jpg)

##### Settings panel:
![](doc/img/settings.jpg)
