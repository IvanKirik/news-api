FROM node:alpine
WORKDIR /opt/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install --save-dev nodemon

EXPOSE 3000

CMD ["npm", "run", "start:dev"]