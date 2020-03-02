FROM node:10

ARG DEPLOY_ENV="dev"

COPY . ./faucet
WORKDIR /faucet

RUN npm install
RUN npm run build

EXPOSE 5556

ENV DEPLOY_ENV=${DEPLOY_ENV}
ENTRYPOINT ["sh", "run_server.sh"]
