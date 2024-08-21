const dotenv = require("dotenv");
dotenv.config();
const env = {
    
    AUTH_SERVICE_SERVICE_PORT : process.env.AUTH_SERVICE_SERVICE_PORT,
    
    AUTH_JWT_SECRET : process.env.AUTH_JWT_SECRET,
    REFRESH_JWT_SECRET : process.env.REFRESH_AUTH_JWT_SECRET,

    AUTH_DB_USERNAME : process.env.AUTH_DB_USERNAME,
    AUTH_DB_PASSWORD : process.env.AUTH_DB_PASSWORD,
    AUTH_DB_HOST : process.env.AUTH_DB_HOST,

    AUTH_MAX_AGE : 3 * 24 * 60 * 60

}

module.exports=env;