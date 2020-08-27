FROM node:10

ARG DEPLOY_ENV="dev"

WORKDIR /faucet


COPY ./package.json ./

RUN npm install

COPY . ./

RUN npm run build
RUN mkdir -p /faucet/state

EXPOSE 5556

ENV DEPLOY_ENV=${DEPLOY_ENV}
ENTRYPOINT ["sh", "run_server.sh"]
