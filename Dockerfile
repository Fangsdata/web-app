FROM node:13

LABEL maintainer="Stefán Örn Hrafnsson stefanorn92@gmail.com"

COPY . /app
WORKDIR /app
RUN npm install --no-package-lock

ENTRYPOINT ["npm", "start"]

# build environment
# FROM node:13 as build
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm ci --silent
# RUN npm install react-scripts@3.4.1 -g --silent
# COPY . ./
# RUN npm run build

# production environment
# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
