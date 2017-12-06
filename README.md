# AsperaConnectAngularSample

---

Angular App using Aspera Connect API and Node API, for file and folder upload+download.
UI using Angular Material components.

My sample is deployed at IBM Cloud:
http://asperaconnectangularsample.eu-de.mybluemix.net/

(its using the std. Aspera Demoserver https://demo.asperasoft.com)

Documentation for the used Aspera APIs:  

- [Aspera Connect Client API](https://developer.asperasoft.com/web/connect-client/all) 
- [Aspera Node API (RESTfull)](https://developer.asperasoft.com/web/node/index)

(Aspera Developer Network subscription needed) 

## run & test local

Run `ng s` to run a local live reload server

## Build & deploy to IBM Cloud

Run `ng build -aot -prod` to build.  The `dist/` directory contains the static WebApp. 
To deploy copy everything in `dist/*` directory to public dir on the webserver.

Deployment to IBM cCloud - cloud foundry ngix:

(a login to the Bluemic cf space needed ):   
```
ng build -aot -prod
cd dist
touch Staticfile
cf p AsperaConnectAngularSample -m 64M
cd ..
``` 



## Todo

- first version
- ...
- ...
- devops integration

## Changelog

- 20171206 - first code / api tests  

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.5.
