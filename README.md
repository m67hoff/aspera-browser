![](img/aspera.png)
## AsperaConnectAngularSample

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

Deployment to IBM Cloud cf-ngix (login to your right Bluemix cf space first):   
```
ng build -aot -prod
cd dist
touch Staticfile
cf p AsperaConnectAngularSample -m 64M
cd ..
``` 



### Todo

- first version
- ...
- ...
- devops integration

### Changelog

- 20171206 - first code / api tests  

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.5.
