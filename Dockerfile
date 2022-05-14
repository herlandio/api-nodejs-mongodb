FROM node:16.13.2
ENV USER = $USER
ENV PASS = $PASS
ENV DB = $DB 
WORKDIR /apimypharmatest
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["node", "./bin/www"]
EXPOSE 8080
