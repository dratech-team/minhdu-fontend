FROM node:14-alpine as build

WORKDIR /usr/local/apps/hrv2

COPY ./package.json /usr/local/apps/hrv2/package.json

RUN npm install

RUN npm run build:prod:hrv2

COPY ./dist/apps/hrv2 ./usr/local/apps/hrv2/

FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/apps/hrv2/dist/hrv2 /usr/share/nginx/html

EXPOSE 85
