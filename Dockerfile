FROM node:latest

RUN apt-get update && apt-get install -y apache2

RUN apt-get install -y mongodb

WORKDIR /var/www/html

COPY package*.json ./

RUN npm install

EXPOSE 3333 27017

CMD service apache2 start && service mongodb start && npm start
