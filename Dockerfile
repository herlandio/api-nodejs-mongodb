FROM node:16.13.2
ENV MONGO_ATLAS_USER=MONGO_ATLAS_USER
ENV MONGO_ATLAS_PWD=MONGO_ATLAS_PWD
ENV MONGO_ATLAS_DB=MONGO_ATLAS_DB
WORKDIR /apimypharmatest
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["node", "./bin/www"]
EXPOSE 8080
