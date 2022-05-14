FROM node:16.13.2
WORKDIR /apimypharmatest
RUN \
  --mount=type=secret,id=USER \
  --mount=type=secret,id=PASS \
  --mount=type=secret,id=DB \
  export USER=$(cat /run/secrets/MONGO_ATLAS_USER) && \
  export PASS=$(cat /run/secrets/MONGO_ATLAS_PWD) && \
  export DB=$(cat /run/secrets/MONGO_ATLAS_DB)
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["node", "./bin/www"]
EXPOSE 8080
