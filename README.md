# API Nodejs e Mongodb

A API foi criada utilizando NodeJS com express, Logs em arquivos, Autenticação JWT, MongoDB com Mongoose conectado no Cloud MongoDB Atlas.

[Documentação da API](https://documenter.getpostman.com/view/15201113/UVsSP4Jj)

1. Clone o repositorio
  
  ```
  git clone https://github.com/herlandio/API-Nodejs-MongoDB
  ```

2. Crie secret keys para o token, refresh token e insira suas credenciais mongodb
  
- Modifique o arquivo ```.env``` e insira a keys geradas, tambem pode alterar a porta da aplicação se quiser

- Altere ```<USER>``` pelo seu usúario cloud mongodb atlas assim como ```<PASS>``` e ```<DB>```

3. Execute  
  ```   
  docker-compose up -d
  ```
