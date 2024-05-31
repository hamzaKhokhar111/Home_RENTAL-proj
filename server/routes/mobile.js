const router = require("express").Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // Assuming you are using JWT


router.get("/:userId/mblnumber", async (req, res) => {
    try {
      const { userId } = req.params
     const {mblnumber}=req.body;
     
    // Create a new User
    const newUser = new User({
        mbl
      });
  
      // Save the new User
      await newUser.save();




    //   const properties = await Listing.find({ creator: userId }).populate("creator")
    //   res.status(202).json(properties)
    // } catch (err) {
    //   console.log(err)
    //   res.status(404).json({ message: "Can not find properties!", error: err.message })
    // }
  })
  

// router.post("/mobile", async (req, res) => {
//     try {
      
//        { mblnumber} = req.body;
  
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(409).json({ message: "User doesn't exist!" });
//       }
  
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: "Invalid Credentials!" });
//       }
  
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//       delete user.password;
  
//       res.status(200).json({ token, user });
  
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ error: err.message });
//     }
//   });
  
//   module.exports = router;
  