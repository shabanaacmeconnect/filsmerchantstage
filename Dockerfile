### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/skote /usr/share/nginx/html
# FROM nginx:1.17.1-alpine
# COPY /dist/skote/ /usr/share/nginx/html
# copy nginx.conf /etc/nginx/conf.d/default.conf

