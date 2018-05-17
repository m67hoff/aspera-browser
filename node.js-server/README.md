![](/doc/img/aspera.png)
## AsperaBrowser -  node.js Server

This is a small node.js server to run AsperaBrowser.

It provides all static files (from folder "webapp") for the AsperaBrowser. And also works as simple "REST proxy" for the Aspera NodeAPI, to forward REST calls from the Angular WebApp to the NodeAPI on the specified transfer server.
(The Rest-call forward is needed to avoid the CORS and SSL exception form the Web-browser.)

### See it live:
My sample is deployed on IBM Cloud:
http://asperabrowser.mybluemix.net
(This sample is preconfigured with a login to the Aspera Demoserver. Just click login)

### Install and run it on you own Server

AsperaBrowser can run on the same system as the Aspera Highspeed Transfer Server or on a separate system with https access to the NodeAPI of the Transfer Server.
The easiest way to install AsperaBrowser is to use the npm module.

### Install on CentOS
## (docu and setup currently under work and todo)

Install Node.js
- https://nodejs.org/en/download
- https://nodejs.org/en/download/package-manager/

```
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
yum -y install nodejs
```

Install asperabrowser
```
npm i -g asperabrowser
```

allow users to run node.js server listen on 80 or 443
```
setcap cap_net_bind_service=+ep /usr/bin/node
```

create user to run the node.js server (security)
```
useradd asperabrowser
```

run it manually
```
su - asperabrowser
asperabrowser
```

setup systemd to run asperabrowser
```
cp /usr/lib/node_modules/asperabrowser/asperabrowser.service /usr/lib/systemd/system/
systemctl daemon-reload
systemctl start asperabrowser
systemctl status asperabrowser
```

check status
```
systemctl status asperabrowser
cat /var/log/messages
ps -fu asperabrowser
```

(optional) create custom config
```
su - asperabrowser
cp /usr/lib/node_modules/asperabrowser/serverconfig.json .
cp /usr/lib/node_modules/asperabrowser/webapp/webappconfig.json .

```
### Additional Infos
More ways to install and run AsperaBrowser are explained in the
[Installation Guide](/doc/Installation_Guide.md)
