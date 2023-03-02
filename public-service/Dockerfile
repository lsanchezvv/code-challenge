FROM node:14-alpine
#USER node
ENV NODE_ENV docker
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start:prod"]
