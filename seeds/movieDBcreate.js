const mongoose = require('mongoose')
const mongoSchema = require('../model/movieGener')
const fs = require('fs')

mongoose.connect('mongodb://127.0.0.1:27017/moviesCollactionData',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    })
        .then(function(conn){
            console.log('success:DB connected')
        })
        .catch(function(err){
            console.log('err:'+err.message)
        })
    fs.readFile('./100-movie-data.json',{encoding: "utf-8"},(err,data)=>{
       if(err){
           console.log(err)
       }
        const Mdata = JSON.stringify(data)
        mongoSchema.insertMany(data)
        .then(function(data){
            console.log('save')
        })
       .catch((err)=>console.log(err.name))
   
   })
   
  
// var done =0;
// for(var i=0;i<MovieDBdata.length;i++){
//     MovieDBdata[i].save(function(err,result){
//         done++;
//         if(done===0){
//             exit();
//         }
//     })
// }
// function exit(){
//     mongoose.disconnect();
// }