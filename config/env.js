const dotenv = require("dotenv");
dotenv.config();
const env = {
    
    AUTH_PORT : process.env.AUTH_PORT,
    
    AUTH_JWT_SECRET : process.env.AUTH_JWT_SECRET,

    AUTH_DB_USERNAME : process.env.AUTH_DB_USERNAME,
    AUTH_DB_PASSWORD : process.env.AUTH_DB_PASSWORD,
    AUTH_DB_HOST : process.env.AUTH_DB_HOST

}

module.exports=env;