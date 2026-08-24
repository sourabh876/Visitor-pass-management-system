require("dotenv").config();

//Error for mongdb connection
const dns = require("dns");
dns.setServers(['8.8.8.8', '1.1.1.1'])

const app = require('./app');

const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000

connectDB();


app.listen(PORT, ()=> {
   console.log(`Server is running on: http://localhost:${PORT}`);
})