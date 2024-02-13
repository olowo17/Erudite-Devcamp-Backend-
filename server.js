const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const colours = require('colors')

// load env variables
dotenv.config({path: './config/config.env' });

//connect to Database
connectDB();

// const logger = require('./middleware/logger')
const morgan = require('morgan')

// routes files

const bootcamps = require ('./routes/bootcamps')

const app = express();

// use logger
// app.use(logger)
// Dev loggin middleware
if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps )


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//Handle unhandled promise rejections
process.on('unhandledRejection',(err, promise)=>{
    console.log(`Error: ${err.message}`.red);
    // close server & exit process
    server.close(()=>process.exit(1));
})