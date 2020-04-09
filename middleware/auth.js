const User = require('../model/User')
const {verify} = require('jsonwebtoken')
module.exports ={
    async authentication (req,res,next)  {
        try {
            const {email} = req.body
            const {accessToken,_id} = await User.findOne({email:email})
            
            if(_id){
                if(accessToken || !accessToken){
                    return next()
                }
                return res.send('You have Not Login Here')
            }
            else return res.send('No User Found')
            
        } catch (error) {
        console.log("Error:"+error.message)
      
    }
},
    async tokenAuth (req,res,next) {
        try{
            const authToken  = req.header('Authorization');            
            if (authToken) {
                const {id} = verify(authToken,process.env.JWT_SECRET_KEY) 
                          
                if(id){
                    
                     req.user = await User.findOne({_id:id}) 
                     next();
                    
                }
                else {
                    console.log('Only Register Person Are Add Movie Detail Only');
                    return res.send('Only Register Person Are Add Movie Detail Only')
                }
            }
            else{
                console.log('Not Authorized without Token');
                return res.send('Not Authorized without Token')
            }

        }catch(err){
            console.log(err.message)
           return  res.send(err.message)
        }
    }  
    
}

