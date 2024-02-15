const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const colours = require('colors')
const errorHandler = require('./middleware/error')
const bootcamps = require ('./routes/bootcamps')


// load env variables
dotenv.config({path: './config/config.env' });

//connect to Database
connectDB();

const morgan = require('morgan')

const app = express();

app.use(express.json())

// Dev loggin middleware
if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps )

app.use(errorHandler)


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//Handle unhandled promise rejections
process.on('unhandledRejection',(err, promise)=>{
    console.log(`Error: ${err.message}`.red);
    // close server & exit process
    server.close(()=>process.exit(1));
})