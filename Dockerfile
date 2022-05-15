FROM node:16.13.2
ARG ARG_PASS
ENV PASS $ARG_PASS
WORKDIR /apimypharmatest
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["node", "./bin/www"]
EXPOSE 8080