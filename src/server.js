// const jsonServer = require('json-server');
// console.log('teste');
// const data = require('./data/investments_mock_server.json');

// const server = jsonServer.create();
// const router = jsonServer.router(data, { _isFake: true });
// console.log(router);
// server.use((req, res, next) => {
//   if (req.path === '/') return next();
//   router.db.setState(data);
//   next();
// });

// server.use(
//   jsonServer.defaults({
//     logger: process.env.NODE_ENV !== 'production',
//   })
// );

// server.use(router);

// module.exports = server;

//import { func } from 'prop-types';
// const express = require('express');
// const app = express();
// const port = 5000;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
