FROM node:latest as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ENV PATH /app/node_modules/.bin:$PATH
ARG SERVER_HOSTNAME
#RUN CI=true npm test
RUN npm run build

FROM alpine/openssl as generate-certs
ARG COUNTRY
ARG STATE
ARG LOCATION
ARG ORGANIZATION
ARG ORGANIZATIONAL_UNIT
ARG COMMON_NAME
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout web.key -out web.crt -subj \
    /C=${COUNTRY}/ST=${STATE}/L=${LOCATION}/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/CN=${COMMON_NAME}

FROM nginx:latest
COPY --from=build-stage /app/build/ /app/build
COPY --from=generate-certs ./ /etc/nginx/certs
COPY ./web.conf /etc/nginx/conf.d/web.conf
