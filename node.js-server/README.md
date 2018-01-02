## node.js Server App for Aspera Connect -  Angular Sample 

This is a small node.js server runtime to forward REST calls from the Angular app to NodeAPI on the specified transfer server.
It also provides all static files (from folder "public") for the Angular client side app. 
(The Rest-call forward is needed to avoid the CORS and SSL exception form the browser.)

See the [Architecture Overview](../Architecture.md) for information how it works. 

### See it live:
My sample is deployed on IBM Cloud:
http://asperabrowser.mybluemix.net

### Build & deploy to IBM Cloud
(Prereq:  Node.js,npm, angular-cli, cloud-foundry-cli installed and IBM Bluemix account )

Start from the base dir for the client App aspera-connect-angular-sample  
Run `ng build -aot -prod` to build.  The `dist/` directory contains the static WebApp. 
To deploy, copy everything in `dist/*` directory to public dir.

Deployment to IBM Cloud Foundry Node.js Buildpack (login to your right Bluemix cf space first):   
```
ng build -aot -prod
mv dist node.js-server/webclient 
cd node.js-server
cf push 
cd ..
``` 
