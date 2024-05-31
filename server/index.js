const express = require("express");
const app = express();
const authRoutes = require('./routes/auth.js');
const listingRoutes = require('./routes/listing.js');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require("cors");
const bookingRoutes=require("./routes/booking.js")
const userRoutes=require('./routes/user.js')

// Load environment variables from .env file
dotenv.config();

/* Middleware Setup */
app.use(cors());
app.use(express.json()); // to parse application/json
app.use(express.urlencoded({ extended: true })); // to parse application/x-www-form-urlencoded

/* Mongoose Setup */
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {
  dbName: "Dream_NesT"
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.log(`${err} did not connect`);
});

app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use('/bookings',bookingRoutes)
app.use("/user",userRoutes)


// Static folder for uploaded images
app.use('/public/uploads', express.static('public/uploads'));

app.get('/bilo', (req, resp) => {
  resp.send("hamza ho yrrr");
});
//hmzii
