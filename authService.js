const express = require('express');
const passport = require('passport');
const cors = require('cors');
const database = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { AUTH_SERVICE_SERVICE_PORT,AUTH_DB_USERNAME, AUTH_DB_PASSWORD, AUTH_DB_HOST } = require('./config/env');


database.connect(AUTH_DB_USERNAME, AUTH_DB_PASSWORD, AUTH_DB_HOST).then(() => {
const app = express();
// middleware

app.use(cors())
app.use(express.json());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());



// routes
//TODO: why the checkUser middleware is only on the get requests ?
app.use('/auth',authRoutes);

app.listen(AUTH_SERVICE_SERVICE_PORT,'0.0.0.0', () => {
  console.log(`Authentication Service is running on port ${AUTH_SERVICE_SERVICE_PORT}`);
});

});
