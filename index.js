const express = require('express');

const mongoose = require('mongoose');

require('dotenv').config();

const connect = mongoose.connect(process.env.MONGO_URI);

const app = express();

const authRoutes = require('./routes/auth.routes.js');

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/v1/auth', authRoutes);

const PORT = process.env.PORT;
app.listen(
  PORT,
  connect
    .then(() => {
      console.log(`Connected to the database successfully`);
    })
    .catch((error) => {
      error,
        console.log(
          `Error connecting to the database, please look through your code.`
        );
    }),
  () => {
    console.log(`Server is connected and listening on port ${PORT}`);
  }
);
