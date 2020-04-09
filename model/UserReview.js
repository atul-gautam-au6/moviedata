const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userreview = new Schema(
    {
        movie_id:{
            type:String,
            required:true,
        },
        user_id:{
            type:String,
            required:true
        },
        Movie_title:{
            type:String,
            require:true
        },
        user_name:{
            type:String,
            required:true
        },
        user_email:{
            type:String,
            required:true
        },
        review:{
            type:String
        },
        rate:{
            type:String
        }
    }
)

const userReviewsSystem  = mongoose.model('User_Review',userreview)
module.exports = userReviewsSystem;