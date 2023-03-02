FROM node:14-alpine
#USER node
ENV NODE_ENV docker
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/src/main" ]
