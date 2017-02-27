# Instructions to run
#### Development environment

Get this api server set up and running before running the <a href='https://github.com/FamilyGenie/fg_react'>fg-react project</a>

`npm install`

##### Mongo temp db

navigate into the `dump` folder that has been provided for you and then run the following commands in order.

1. create a data folder for db storage
2. `mongod --dbpath <FOLDER_NAME`
3. `mongorestore -d <FOLDER_NAME> --db <DATABASE_NAME> [--drop]` (use `--drop` if you need to clear out your existing db)

##### Node server

run the `fg_apiserver.js` with either `node` or `nodemon` if you have it installed.
