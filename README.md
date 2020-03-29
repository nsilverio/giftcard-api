# giftcard-api

1. Create package.json 
```
npm init
```
2. Install dependencies:
    -  Express: Node.js web application framework 
    -  Dotenv: zero-dependency module that loads environment variables from a .env file into process.env
    - Morgan: HTTP request logger middleware for Node.js used to log morgan stream data
```
npm i express dotenv morgan
```
3. Install nodemon as dev dependency
```
npm i -D nodemon
```
4. Update scripts section on package.json 
```
"scripts": {
    "start": "NODE_ENV=production node server",
    "dev": "nodemon server"
  }
```


