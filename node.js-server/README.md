![](/doc/img/aspera.png)
## AsperaBrowser -  node.js Server

a simple node.js server to run the AsperaBrowser Angular WebApp.

It provides all static files (from folder "webapp") for the AsperaBrowser. And also works as simple "REST proxy" for the Aspera NodeAPI, to forward REST calls from the AsperaBrowser WebApp to the NodeAPI on the specified Aspera Transfer Server.
(The Rest-call forward is needed to avoid CORS and SSL exceptions form the client Browser)

### See it live:
A sample is deployed on IBM Cloud:
[asperabrowser.mybluemix.net](https://asperabrowser.mybluemix.net)
(This sample is preconfigured with a login to the Aspera Demoserver. Just click login)

#### AsperaBrowser WebApp:
this node.js server is just a server side "helper" to provide the AsperaBrowser WebApp. The Angular App is maintained on [GitHub aspera-browser project](/)

### Install and run it on you own Server

AsperaBrowser can run on the same system as the Aspera Highspeed Transfer Server or on a separate system with https access to the NodeAPI of the Transfer Server.
The easiest way to install AsperaBrowser is to use the npm module.

### Install on CentOS
(all steps need to run root)
### Beta version: docu and setup currently under work!

Install Node.js 
- https://nodejs.org/en/download
- https://nodejs.org/en/download/package-manager/

```
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
yum -y install nodejs
```

Install asperabrowser (global)
```
npm i -g asperabrowser
```

config systemd to run asperabrowser as service and start the service
```
asperabrowser --config
```

check status
```
asperabrowser -s
```

(optional) copy config files for customization 
```
asperabrowser --defaults
```
### Additional Infos
More ways to install and run AsperaBrowser are explained in the
[Installation Guide](/doc/Installation_Guide.md)
