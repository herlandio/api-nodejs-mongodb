FROM node:16.13.2
RUN --mount=type=secret,id=PASS \
   export PASS=$(cat /run/secrets/PASS)
WORKDIR /apimypharmatest
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["node", "./bin/www"]
EXPOSE 8080