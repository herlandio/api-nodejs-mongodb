FROM node:16.13.2
WORKDIR /apimypharmatest
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["node", "./bin/www"]
EXPOSE 8080
RUN --mount=type=secret,id=PASS \
   export PASS=$(cat /run/secrets/PASS)