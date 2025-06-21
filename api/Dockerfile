FROM rust:latest as build
RUN USER=root cargo new --bin api
WORKDIR /api
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./certificates /usr/local/share/ca-certificates
RUN update-ca-certificates
RUN cargo build --release

RUN rm src/*.rs
COPY ./src ./src
RUN rm ./target/release/deps/api*
RUN cargo build --release

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
ARG DATABASE_HOSTNAME
ARG DATABASE_PORT
ARG DATABASE_NAME
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD
ARG SERVER_HOSTNAME
ARG SMTP_FROM
ARG SMTP_SERVER
ARG SMTP_USE_TLS
COPY --from=build /api/target/release/api .
COPY --from=generate-certs ./ /etc/nginx/certs
COPY ./web.conf /etc/nginx/conf.d/web.conf
