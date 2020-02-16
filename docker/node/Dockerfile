# FROM official Node image
FROM node:10.16 as node
## Custom specifications
### Install Chromium for lighthouse (Problem with chromium latest (version 73.0.3683.75-1~deb9u1) See : https://github.com/GoogleChrome/lighthouse/issues/7246
RUN apt-get update
RUN apt-get install -y chromium=70.0.3538.110-1~deb9u1
### Others specification
WORKDIR /usr/src/app