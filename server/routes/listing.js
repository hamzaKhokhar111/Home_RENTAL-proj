const multer = require('multer');
const router = require('express').Router();
const Listing = require('../models/Listing');
const User = require('../models/User'); // Assuming User model is in models folder

// Configuration Multer for File Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to the original file name
  },
});

const upload = multer({ storage });

router.post("/create", upload.array("listingPhotos", 10), async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files;
    if (!listingPhotos || listingPhotos.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    const listingPhotoPaths = listingPhotos.map((file) => file.path);

    let amenitiesParsed;
    try {
      amenitiesParsed = JSON.parse(amenities);
    } catch (error) {
      return res.status(400).json({ message: "Invalid amenities format" });
    }

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities: amenitiesParsed,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });

    await newListing.save();
    res.status(200).json(newListing);
  } catch (error) {
    res.status(409).json({ message: "Fail to create Listing", error: error.message });
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  const qcategory = req.query.category;
  try {
    let listings;
    if (qcategory) {
      listings = await Listing.find({ category: qcategory }).populate("creator");
    } else {
      listings = await Listing.find();
    }
    res.status(200).json(listings);
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listing" });
    console.log(err);
  }
});


/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params
    const listing = await Listing.findById(listingId).populate("creator")
    res.status(202).json(listing)
  } catch (err) {
    res.status(404).json({ message: "Listing can not found!", error: err.message })
  }
})


/* GET LISTINGS BY SEARCH */
router.get("/search/:search", async (req, res) => {
  const { search } = req.params

  try {
    let listings = []

    if (search === "all") {
      listings = await Listing.find().populate("creator")
    } else {
      listings = await Listing.find({
        $or: [
          { category: {$regex: search, $options: "i" } },
          { title: {$regex: search, $options: "i" } },
        ]
      }).populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
})


module.exports = router;
