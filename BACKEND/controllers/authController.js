const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login=async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({message:'All fields are required'});
    }
    const user=await User.findOne({where:{email}});
    if(!user){
      return res.status(404).json({message:'User not found'});
    }
    if(user.password!==password){
      return res.status(401).json({message:'User not authorized'});
    }
    return res.status(200).json({
      message:'User login successful',
      user:{
        id:user.id,
        name:user.name,
        email:user.email
      }
    })
  }
  catch(error){
    console.error(error);
    return res.status(500).json({message:'Server error'});
  }
}
