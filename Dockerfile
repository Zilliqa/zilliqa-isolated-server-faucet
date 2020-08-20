FROM node:10

ARG DEPLOY_ENV="dev"

WORKDIR /faucet

COPY ./package.json ./

RUN npm install
RUN npm run build

COPY . ./

EXPOSE 5556

ENV DEPLOY_ENV=${DEPLOY_ENV}
ENTRYPOINT ["sh", "run_server.sh"]
