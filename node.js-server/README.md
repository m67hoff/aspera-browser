![](../doc/img/aspera.png)
## AsperaBrowser -  node.js Server 

This is a small node.js server to run AsperaBrowser.

It provides all static files (from folder "webclient") for the AsperaBrowser. And also works as simple "REST proxy" for the Aspera NodeAPI, to forward REST calls from the Angular WebApp to the NodeAPI on the specified transfer server. 
(The Rest-call forward is needed to avoid the CORS and SSL exception form the Web-browser.)

### See it live:
My sample is deployed on IBM Cloud:
http://asperabrowser.mybluemix.net
(This sample is preconfigured with a login to the Aspera Demoserver. Just click refresh to login)

### Install and run it on you own Server

AsperaBrowser can run on the same system as the Aspera Highspeed Transfer Server or on a separate system with https access to the NodeAPI of the Transfer Server.  

The easiest way to install AsperaBrowser is to use the npm module.

Install it with `npm i -g xxxx`

Than:    
xx

xx


More ways to install and run AsperaBrowser are explained in the 
[Installation Guide](../doc/Installation_Guide.md) 
