const movieDb = require('../model/movieGener')
const fuzzysearch = require('mongoose-fuzzy-searching')
const usermovieSys = require('../model/UserReview')
const userdashboard = require('../model/User')
module.exports = {
    async allMovie (req,res){
        try{
            const {page,perPage,rate,title} = req.query;
            
            const option = {
                page:parseInt(page,10)||1,
                limit:parseInt(perPage,10)||10
            }
            function escapeRegex(text) {
                var name = text || '';
                return name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            };
            const regex = new RegExp(escapeRegex(title), 'gi');
            const movie = await movieDb.paginate({$and:[{title:regex},{vote_average:{$gte:rate||0}}]},option)//()
            return res.json(movie)
        }
        catch(err){
            console.log(err)
            return res.status(500).send(err)
        }
    },
    async toprated (req,res){
        try{
            const {page,perPage,rate,title} = req.query;
            
            const option = {
                page:parseInt(page,10)||1,
                limit:parseInt(perPage,10)||10
            }
            function escapeRegex(text) {
                var name = text || '';
                return name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            };
            const regex = new RegExp(escapeRegex(title), 'gi');
            const movie = await movieDb.paginate({$and:[{title:regex},{vote_average:{$gte:rate||7}}]},option)//()
            return res.json(movie)
        }
        catch(err){
            console.log(err)
            return res.status(500).send(err)
        }
    },
   
   
        async addMovieData(req,res){
            try {
                const movies_Details = req.body;
                 if(!movies_Details){
                    return res.send('Please Enter Some Required Movies Reletaed Data');
                }
                const {_id,name,email} = req.user
                const  moviesdataDoc  = await  movieDb.create({...movies_Details})
                const userreviedata = await usermovieSys.create({
                    "movie_id" : moviesdataDoc._id,
                    "user_id"  : _id,
                    "Movie_title":moviesdataDoc.title,
                    "user_name":name,
                    "user_email":email,
                    "review": ' ',
                    "rate":''
                })
                
          
            return res.status(201).json({
                statusCode: 201,
                moviesdataDoc ,
                userreviedata 
                         
            });
        }
        catch (err){
            return res.send(err.message)
        }
            
         },

    async reviewSystem(req,res) {
        
        try {
            const {title,id,review,rate} = req.body;
            const conform  = await usermovieSys.findOne({$and : [ {movie_id:id},{user_id:req.user._id} ]})   
        if(!conform) {
            if (title && id){
                const matchingmoviesTitle = await  movieDb.findOne({$and:[ {title:title},{_id:id} ]})
                if(matchingmoviesTitle){
                if(review || rating){
                        const reviewSys = await usermovieSys.create({
                        "movie_id" : id,
                        "user_id"  :req.user._id,
                        "Movie_title":title,
                        "user_name":req.user.name,
                        "user_email":req.user.email,
                        "review": review,
                        "rate":rate
                        
                    })
                  await  movieDb.findOneAndUpdate(
                       {_id:id},
                       {$push:{UserReviews:[{Name:req.user.name,Email:req.user.email,Reviews:review}]}}
                   )
                   await userdashboard.findOneAndUpdate(
                       {_id:req.user._id},
                       {$push:{movieInfo:[{movie_id:id,movie_title:title,rate:rate,Review:review}]}}
                   )
                   
                    let {vote_count,vote_average} = await movieDb.findOne({_id :id}) 
                     let averageVote = parseInt(vote_average)                  
                    let voters =parseInt( vote_count);   
                    
                    
                    
                    //update rating
                        //  where:
        //   R = average for the movie (mean) = (Rating)
        //   v = number of votes for the movie = (votes)
        //   m = minimum votes required to be listed in the Top 250 (currently 1250)
        //   C = the mean vote across the whole report (currently )
                    let R = rate;
                    let v = voters;
                    let m = 1250;
                    let C = averageVote
                    
                    var rank  = (v / (v+m)) * R + (m / (v+m)) * C;
                    var inputValue=rank.toString()           
                    var afterDot = '';
                    var beforeDots = inputValue.split('.'); 
                    var beforeDot = beforeDots[0];
                    if(beforeDots[1]){
                         var afterDot = beforeDots[1];
                            if(afterDot.length > 3 ){
                            afterDot = afterDot.slice(0, 2);               
                            }
                    afterDot = '.'+ afterDot;
        
            }
            if(beforeDot){                  
                if(beforeDot.length > 6 ){          
                    beforeDot = beforeDot.slice(0, 6);                      
                }
                if(beforeDots[1] == ''){
                    beforeDot = beforeDot + '.';
                }
            }
            inputValue = beforeDot + afterDot;
            voters =parseInt( vote_count)+1
            await movieDb.updateOne({_id:id},{vote_average:inputValue})
            await movieDb.updateOne({_id:id},{vote_count:voters})           
            
            return res.status(201).json({
               
                statusCode: 201,
                'message':"Thanks for gives some feedback"
                         
            });
           
        
                   
                }
            
                else{
                    return res.send('please give me rating or review')
                }
            }
            else {
                return res.send('Id And Title are not matched')
            }
            }
            else {
                return res.send('please enter the title or id something !')
            }
        }
        else {
            return res.send('Please Dont Do this Duplicate!!!')
        }
        } catch (error) {
            return res.send(error.message)
        }
    },
    

}