![](doc/img/aspera.png)
## AsperaBrowser -  Angular Sample App to Aspera Connect & Node API  

Angular App using Aspera Connect API and Node API, for file and folder upload+download.
UI using Angular Material components.

See the [Architecture Overview](doc/Architecture.md) for information how it works. 

### See it live:
My sample is deployed on IBM Cloud:
http://asperabrowser.mybluemix.net
(This sample is preconfigured with a login to the Aspera Demoserver. Just click refresh to login)

### node.js server / use it on you own system
Normally the AsperaBrowser is provided by a node.js web server. See the [node.js-server directory](node.js-server) to use/install it on your own system.

### Build the AsperaBrowser Angular
This directory contains the sources for the Angular App. It can be deployed as a static SPA (see [Installation Guide](doc/Installation_Guide.md))
To build the AsperaBrowser Angular App run `npm build`.  This will create a new build in the `node.js-server/webclient/` directory that contains the static WebApp.   

### Todo / planned 
- npm package
- Docs & more Docs
- Transfer Management in UI 
- devops integration (travis / greenkeeper)

### Changelog
- 20171206 - first simple download 
- 20171212 - nodeAPI browse sample 
- 20171214 - upload sample  
- 20171216 - tokenauth  
- 20171217 - UI layout  & settings panel
- 20171218 - delete file & some docu 
- 20171218 - breadcrumb folder navi
- 20171219 - table sort filter paginator 
- 20171220 - tokenauth toggle / New Folder / delete confirmation
- 20171227 - settings changed validation
- 20171231 - update angular / deploy as node.js
- 20180105 - node.js middleware (first & simple version)
- 20180108 - some simple error handling
- 20180115 - simple config files 
- 20180508 - version footer & docu 

### Screenshots 

##### Browse Directory:
![](doc/img/browse.jpg)

##### Settings panel:
![](doc/img/settings.jpg)


---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 
