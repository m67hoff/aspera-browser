![](img/aspera.png)
## Aspera Connect -  Angular Sample 

---

Angular App using Aspera Connect API and Node API, for file and folder upload+download.
UI using Angular Material components.

See the [Architecture Overview](Architecture.md) for information how it works. 

### See it live:
My sample is deployed on IBM Cloud:
http://asperaconnectangularsample.eu-de.mybluemix.net

### run & test local
(Prereq: Node.js,npm and angular cli installed)

Run `ng s` to start the Angular Live Development Server,
open your browser on http://localhost:4200/

### Build & deploy to IBM Cloud
(Prereq: as above + cloud foundry cli installed and IBM Bluemix accout )

Run `ng build -aot -prod` to build.  The `dist/` directory contains the static WebApp. 
To deploy copy everything in `dist/*` directory to public dir on the webserver.

Deployment to IBM Cloud cf-nginx (login to your right Bluemix cf space first):   
```
ng build -aot -prod
cd dist
touch Staticfile
cf p AsperaConnectAngularSample -m 64M
cd ..
``` 

### Todo
- size pipe
- cred settings 
- UI colums style
- Docu
- node.js rest forward 
- breadcrumb folder naivi
- table filter 
- table sort 
- delete Files 
- New Folder
- devops integration (travis / greenkeeper)

### Changelog
- 20171206 - first code / simple download 
- 20171212 - nodeAPI browse sample 
- 20171214 - upload sample  
- 20171216 - tokenauth  

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 
