const express = require('express');
const passport = require('passport');
const cors = require('cors');
const database = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { checkUser } = require('./middleware/checkUser');
const { AUTH_SERVICE_SERVICE_PORT,AUTH_DB_USERNAME, AUTH_DB_PASSWORD, AUTH_DB_HOST } = require('./config/env');
require('./config/passport'); // Include passport configuration

database.connect(AUTH_DB_USERNAME, AUTH_DB_PASSWORD, AUTH_DB_HOST).then(() => {
const app = express();
// middleware

app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


// routes
//TODO: why the checkUser middleware is only on the get requests ?
app.get('*', checkUser);
app.use('/auth',authRoutes);

app.listen(AUTH_SERVICE_SERVICE_PORT,'0.0.0.0', () => {
  console.log(`Authentication Service is running on port ${AUTH_SERVICE_SERVICE_PORT}`);
});

});
