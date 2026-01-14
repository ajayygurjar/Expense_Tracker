const express=require('express');

const router=express.Router();
const {forgotpassword}=require('../controllers/passwordController');

router.post('/forgotpassword',forgotpassword);

module.exports=router;