# API Nodejs e Mongodb [Fora do ar]

A API foi criada utilizando NodeJS com express, Logs em arquivos, Autenticação JWT, MongoDB com Mongoose conectado no Cloud MongoDB Atlas.

- Postman [Documentação da API](https://documenter.getpostman.com/view/15201113/UVsSP4Jj)
- Swagger [Documentação da API](https://api-nodemongo.herokuapp.com/docs)

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
  
4. Uso da API
  - Crie seu usuario no endpoint abaixo:

```
https://api-nodemongo.herokuapp.com/users/create
```
  - Logue na api no endpoint abaixo:
```
https://api-nodemongo.herokuapp.com/users/login
```
  - Copie o refresh_token retornado na chamada e use no bearer token nas chamadas dos endpoints
  - Para saber mais sobre os endpoints acesse a documentação.
  - Ao utlizar o swagger o authorize deve ser no formato abaixo, conforme exemplo abaixo, substitua a palavra token pelo token.

```
bearer token
```
