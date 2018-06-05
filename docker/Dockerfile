 FROM node:8.6.0  
   
 RUN mkdir -p /usr/src/app/node  
 RUN chmod -R 777 /usr/src/app/node  

 RUN npm i npm -g
 RUN npm install nodemon -g  
   
 WORKDIR /usr/src/app/node  

 # COPY app/package.json /usr/src/app/node/package.json  
 # RUN npm install -g  
   
 EXPOSE 8080  
 EXPOSE 5858  
   
 CMD ["npm", "start"]  