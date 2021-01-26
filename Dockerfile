FROM node:13

LABEL maintainer="Stefán Örn Hrafnsson stefanorn92@gmail.com"

ENV NODE_ENV production
ENV PORT 3000
ENV API_URL https://fangsdata-api.herokuapp.com/api 

COPY . /app
WORKDIR /app
RUN npm install --no-package-lock

ENTRYPOINT ["npm", "start"]
