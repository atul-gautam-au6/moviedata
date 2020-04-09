const { Router } = require("express");
const { authentication,tokenAuth }  = require('../middleware/auth')


const passport = require("passport");
const { register, login,dashboard,updatereview, EmailVerification,changePassword, logout ,forgetpassword,forgetpasswordform,forgetPasswordUpdate} = require("../controller/User_controller/userController");

const router = Router();

//user login registration routes
router.post("/user/register", register);
router.post( "/user/login",passport.authenticate("local", { session: false }),authentication ,login);
router.post("/user/dashboard",tokenAuth,dashboard)
router.post('/user/updatereview',tokenAuth,updatereview)
router.post( '/user/logout',tokenAuth, logout )

//all nodemailler/mail routes
router.get('/user/confirmation/:token',EmailVerification)                    //email varification routes
router.post('/user/password/changepassword',tokenAuth ,changePassword)       //password update routes
router.post('/user/password/forgetpassword' ,forgetpassword)   //forget password route
router.get('/user/password/forgetEmailPassword/:token',forgetpasswordform)            //forget password form
router.post('/user/password/update',forgetPasswordUpdate)                    //forget password update route



module.exports = router;



