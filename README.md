# Backend for Coral Rent Project

Developer onboarding - prepare env:

Install NPM
Install Node
Install docker
Clone the repository
Run "npm install""

To test:
Run mongo with Docker:
docker pull mongo
docker run --name coral-db -p 27017:27017 -d mongo

Run coral-backend in test mode: 
npm test

To make docker-compose work, you must replace on package.json:
    "test": "DB_CONNECTION=mongodb://localhost:27017/coral-db node ./bin/www"
  by
    "test": "DB_CONNECTION=mongodb://mongo:27017/coral-db node ./bin/www"
