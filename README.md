![](img/aspera.png)
## Aspera Connect -  Angular Sample 


Angular App using Aspera Connect API and Node API, for file and folder upload+download.
UI using Angular Material components.

See the [Architecture Overview](Architecture.md) for information how it works. 

### See it live:
My sample is deployed on IBM Cloud:
http://asperabrowser.mybluemix.net

### run & test local
(Prereq: Node.js,npm and angular cli installed)

Run `ng s` to start the Angular Live Development Server

### Build & deploy to IBM Cloud
(Prereq: as above + cloud foundry cli installed and IBM Bluemix account )

Run `ng build -aot -prod` to build.  The `dist/` directory contains the static WebApp. 
To deploy, copy everything in `dist/*` directory to public dir on the webserver.

Deployment to IBM Cloud cf-nginx (login to your right Bluemix cf space first):   
```
ng build -aot -prod
cd dist
touch Staticfile
cf p myAsperaBrowser -m 64M
cd ..
``` 

### Todo / planned 
- node.js rest forward 
- breadcrumb folder navi
- New Folder
- delete confirmation
- error handling in UI
- table sort 
- table filter 
- local cred save 
- npm package
- Transfer Management in UI 
- devops integration (travis / greenkeeper)

### Changelog
- 20171206 - first code / simple download 
- 20171212 - nodeAPI browse sample 
- 20171214 - upload sample  
- 20171216 - tokenauth  
- 20171217 - UI layout  & settings panel

### Screenshots 

##### Browse Directory:
![](img/browse.jpg)

##### Settings panel:
![](img/settings.jpg)


---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 
