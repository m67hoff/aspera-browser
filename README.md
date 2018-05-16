![](doc/img/aspera.png)
## AsperaBrowser -  Angular Sample App to Aspera Connect & Node API  

Angular App using Aspera Connect API and Node API, for file and folder upload+download.
UI using Angular Material components.

### See it live:
My sample is deployed on IBM Cloud:
http://asperabrowser.mybluemix.net
(This sample is preconfigured with a login to the Aspera Demoserver. Just click refresh to login)

### use it on you own system / node.js server
Normally AsperaBrowser is provided by a node.js web server. See the [node.js-server directory](node.js-server) to use/install it on your own system.

### Build the AsperaBrowser Angular
This directory contains the sources for the Angular App. It can be deployed as static SPA (see [Installation Guide](doc/Installation_Guide.md))
To build the AsperaBrowser Angular App run `npm run build`.  This will create a new build in the `node.js-server/webapp/` directory that contains the static WebApp.   

[Architecture Overview](doc/Architecture.md) provides information on the application components and the used APIs. 

### Todo / planned 
- npm package
- Docs & more Docs
- Transfer Management in UI 
- devops integration (travis / greenkeeper)

### Screenshots 

##### Browse Directory:
![](doc/img/browse.jpg)

##### Settings panel:
![](doc/img/settings.jpg)


---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 
