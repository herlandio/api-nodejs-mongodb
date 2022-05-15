FROM node:16.13.2

ENV USER $VAR_USER
ENV PASS $VAR_PASS
ENV DB $VAR_DB 

WORKDIR /apimypharmatest
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["node", "./bin/www"]
EXPOSE 8080
