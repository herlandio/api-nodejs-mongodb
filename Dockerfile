FROM node:16.13.2
ENV ${{ secrets.MONGO_ATLAS_USER }}
ENV ${{ secrets.MONGO_ATLAS_PWD }}
ENV ${{ secrets.MONGO_ATLAS_DB }}
WORKDIR /apimypharmatest
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["node", "./bin/www"]
EXPOSE 8080
