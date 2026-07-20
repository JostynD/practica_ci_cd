FROM node:20-alpine

WORKDIR /usr/src/app

COPY app/package.json ./
RUN npm install --production

COPY index.js ./

EXPOSE 3000

CMD ["npm", "start"]
