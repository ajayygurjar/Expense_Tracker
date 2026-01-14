const express = require("express");

const router = express.Router();
const { forgotpassword,resetpassword,updatepassword } = require("../controllers/passwordController");

router.post("/forgotpassword", forgotpassword);
router.get("/resetpassword/:id", resetpassword);
router.get('/updatepassword/:resetpasswordid', updatepassword);

module.exports = router;
