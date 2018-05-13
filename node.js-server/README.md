![](../doc/img/aspera.png)
## Aspera Browser -  node.js Server for Aspera Browser and proxy to Aspera Node API  

This is a small node.js server runtime to forward REST calls from the Angular app to NodeAPI on the specified transfer server.
It also provides all static files (from folder "webclient") for the Aspera Browser - Angular client side app. 
(The Rest-call forward is needed to avoid the CORS and SSL exception form the browser.)

## See it live:
My sample is deployed on IBM Cloud:
http://asperabrowser.mybluemix.net
(This sample is preconfigured with a login to the Aspera Demoserver. Just click refresh to login)

### Install and run it on you own Server

The AsperaBrowser can run on the same system as the Aspera Highspeed Transfer Server or on a separate system the has https access to the NodeAPI of the Transfer Server.  

The easiest way to install AsperaBrowser is to use the npm module.

Install it with `npm i -g xxxx`

Than:    
xx

xx


More ways to install and run AsperaBrowser are explained in the 
[Installation Guide](../doc/Installation_Guide.md) 

### Build & deploy to IBM Cloud
(Prereq:  Node.js,npm, angular-cli, cloud-foundry-cli installed and IBM Bluemix account )

The branch **bluemix_deploy**, has a severconfig.json & clientconfig.json that works with a single node.js server.
Also it sends data to Google statistics (in index.html)   

##### 1) Build the AsperaBrowser Angular
If the AsperaBrowser Agular App has also changed rebuild it from the **parent dir** with `npm build` .  This will create a new build in the `webclient/` directory that contains the static WebApp. 

##### 2) Deploy to IBM Cloud 
first check your login to the right  IBM Cloud Foundry Space with:
`cf t ; cf a`
Deploy to this space with:   
```
cf push 
``` 
(you may need to change the host in `manifest.yml` since the URL AsperaBrowser is already taken by my sample.)