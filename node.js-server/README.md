![](/doc/img/aspera.png)
## AsperaBrowser -  node.js Server

a simple node.js server to run the AsperaBrowser Angular WebApp.

It provides all static files (from folder "webapp") for the AsperaBrowser. And also works as simple "REST proxy" for the Aspera NodeAPI, to forward REST calls from the AsperaBrowser WebApp to the NodeAPI on the specified Aspera Transfer Server.
(The Rest-call forward is needed to avoid CORS and SSL exceptions form the client Browser)

(:exclamation: At the moment this is just a personal project, to get familiar with the Aspera APIs and technology, and not an "official" open source project from IBM / Aspera)

### See it live:
A sample is deployed on IBM Cloud:
[asperabrowser.mybluemix.net](https://asperabrowser.mybluemix.net)
(This sample is preconfigured with a login to the Aspera Demoserver. Just click login)

#### AsperaBrowser WebApp:
this node.js server is just a server side "helper" to provide the AsperaBrowser WebApp. The Angular App (source) is maintained on [GitHub aspera-browser project](https://github.com/m67hoff/aspera-browser)

#### Features:
- modern, fast & intuitive to use WebUI
- browse, upload, download to any Aspera Transfer Server or ATS/Folder Access-Key - local or remote
- drag-and-drop to upload
- see and manage your transfer activity
- "goto" feature together with aslmcli
- cloud or on-prem
- separate or on same system as Transfer Server
- support for HTTPS 
- runs everywhere: Linux, Mac, Windows (node.js)   
- Docker Image available  
- highly configurable
- just uses Aspera Connect and NodeAPI
- can host connect and all libs to run in internal networks
- Angular SPA can also run separate from the node.js server
- opensource

### For more Information how to use/install it on your own system see the  
### [AsperaBrowser Handbook](https://github.com/m67hoff/aspera-browser/wiki) 

### Screenshot 
![](/doc/img/browse.jpg)