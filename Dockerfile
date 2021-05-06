FROM nginx:1.17.1-alpine
COPY /dist/ /usr/share/nginx/html
copy nginx.conf /etc/nginx/conf.d/default.conf
