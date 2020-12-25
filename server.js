const express = require('express');
const path = require('path');

const publicDirectory = path.join(__dirname, 'lib');

const app = express();
app.use(express.static(publicDirectory));

const port = parseInt(process.env.PORT, 10) || 8080;
app.listen(port, () =>
  console.log(
    `Ethereum Studio is listening on port ${port}\nPublic directory path set to ${publicDirectory}`
  )
);