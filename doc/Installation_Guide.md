## AsperaBrowser -  Installation Guide

### run & test local development version
(Prereq: Node.js,npm and angular cli installed)

Git clone

npm install in both dirs

Run `npm start` to start the Angular Live Development Server

Run the node.js server in dir with `npm run live`
 

### Build & deploy to IBM Cloud
(Prereq:  Node.js,npm, angular-cli, cloud-foundry-cli installed and IBM Bluemix account )

The branch **bluemix_deploy**, has a severconfig.json & webappconfig.json that works with a single node.js server.
Also it sends data to Google statistics (in index.html)   

##### 1) Build the AsperaBrowser Angular
If the AsperaBrowser Agular App has also changed rebuild it from the **parent dir** with `npm run build` .  This will create a new build in the `webapp/` directory that contains the static WebApp. 

##### 2) Deploy to IBM Cloud 
first check your login to the right  IBM Cloud Foundry Space with:
```
cf t ; cf a
```
Deploy to this space with:   
```
cf p 
``` 
(you may need to change the host in `manifest.yml` since the URL AsperaBrowser is already taken by my sample.)2