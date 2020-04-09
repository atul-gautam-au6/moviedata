const express = require('express')
const dotenv = require('dotenv')
const passport = require('passport')
const morgan = require('morgan')
const GetRoutes = require('./Routes/AllUserRoutes')
const movieRoute = require('./Routes/movie_apiRoute.js')
//const path = require('path')
//var bodyParser = require('body-parser');

dotenv.config();
require('./db')
require('./passport')
const PORT=process.env.PORT || 5050

//initilization
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:false }))
app.use(morgan('dev'));

app.use(passport.initialize());


app.get('/',(req,res)=>{
    res.send('hello')
})
//get routes
app.use(GetRoutes)

//movie api Routes
app.use(movieRoute)


app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`)
})