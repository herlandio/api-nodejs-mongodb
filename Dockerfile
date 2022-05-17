FROM node:16.13.2

ARG ARG_USER
ARG ARG_PASS
ARG ARG_DB
ARG ARG_TOKEN
ARG ARG_REFRESH_TOKEN

ENV USER $ARG_USER
ENV PASS $ARG_PASS
ENV DB $ARG_DB
ENV TOKEN $ARG_TOKEN
ENV REFRESH_TOKEN $ARG_REFRESH_TOKEN

WORKDIR /apimypharmatest
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD ["node", "./bin/www"]
<<<<<<< HEAD
EXPOSE 8080
=======
EXPOSE 8080
>>>>>>> 3e4eb2d440f912a7bd5ac9a3879d7ddecbc8242d
