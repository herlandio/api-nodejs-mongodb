FROM node:16.13.2

ARG USER $VAR_USER
ARG PASS $VAR_PASS
ARG DB $VAR_DB 

WORKDIR /apimypharmatest
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["node", "./bin/www"]
EXPOSE 8080
