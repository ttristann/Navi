// const express = require('express');
// const cors = require('cors');

// const app = express();

// app.use(express.json());
// app.use(cors());

// app.get('/adduser', (req, res) => {
// //   const { name, email } = req.query;
// //   console.log(`Name: ${name}, Email: ${email}`);
// //   res.send('User added');
//     console.log(req.body);
//     res.send("Response received");
// });

// app.listen(4000, () => console.log('Server on localhost 4000'));
import express from 'express';

const app = express();

app.listen(4000, () => {
  console.log('Server on localhost 4000');
});