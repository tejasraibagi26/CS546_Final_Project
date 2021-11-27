const express = require("express");
const router = express.Router();
const data = require("../data");
const errorHandler = require("../Errors/errorHandler");
const venue = data.venues;
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const min = parseInt(req.query.min) || 0;
  const max = parseInt(req.query.max) || 1000000;
  const rating = parseInt(req.query.rating) || 0;
  let array = [searchTerm];

  if (!searchTerm) {
    try {
      const getVenues = await venue.searchVenue(searchTerm, min, max, rating);
      res.render("venue/searchResult", {
        title: "Search Results",
        venues: getVenues,
        count: getVenues.length,
      });
      return;
    } catch (error) {
      res.status(404).render("venue/searchResult", {
        title: "Search Result",
        err: true,
        error: error,
        searchTerm,
      });
      return;
    }
  } else if (min && max && rating && searchTerm) {
    try {
      errorHandler.checkIfElementsExists(array);
    } catch (error) {
      res.status(400).json({ err: error });
      return;
    }

    try {
      errorHandler.checkIfElementsAreStrings(array);
    } catch (error) {
      res.status(400).json({ err: error });
      return;
    }

    try {
      errorHandler.checkIfElementNotEmptyString(array);
    } catch (error) {
      res.status(400).json({ err: error });
      return;
    }
    try {
      const fetchVenue = await venue.searchVenue(searchTerm, min, max, rating);
      res.render("venue/searchResult", {
        title: "Search Result",
        venues: fetchVenue,
        count: fetchVenue.length,
        searchTerm: searchTerm,
      });
      return;
    } catch (error) {
      res.status(404).render("venue/searchResult", {
        title: "Search Result",
        err: true,
        error: error,
        searchTerm,
      });
      return;
    }
  }

  try {
    const fetchVenue = await venue.searchVenue(searchTerm, min, max, rating);
    res.render("venue/searchResult", {
      title: "Search Result",
      venues: fetchVenue,
      count: fetchVenue.length,
      searchTerm: searchTerm,
    });
    return;
  } catch (error) {
    res.status(404).render("venue/searchResult", {
      title: "Search Result",
      err: true,
      error: error,
      searchTerm,
    });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  let array = [id];
  try {
    errorHandler.checkIfElementsExists(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfValidObjectId(id);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    const getVenue = await venue.getVenueById(id);
    res.status(200).render("venue/venuePage", {
      title: getVenue.venueName,
      venue: getVenue,
      reviewCount: getVenue.reviews.length,
    });
  } catch (error) {
    res.status(404).json({ err: error });
  }
});

router.post("/create", upload.single("venueImage"), async (req, res) => {
  let { venueName, venueAddress, venueTimings, venueSlots, sports, price } =
    req.body;

  let venueImage = req.file.filename;
  let venueTimeArrObj = [];
  let venueApproved = false;
  venueTimings.forEach((time) => {
    let obj = {};
    obj.timeSlot = time;
    obj.slotsAvailable = parseInt(venueSlots);
    venueTimeArrObj.push(obj);
  });

  price = parseInt(price);
  let array = [
    venueName,
    venueAddress,
    venueTimeArrObj,
    venueImage,
    sports,
    price,
  ];

  try {
    errorHandler.checkIfElementsExists(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  array = [venueName, venueAddress, venueImage];

  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfValidArrayObject(venueTimeArrObj);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    const createVenue = await venue.createNewVenue(
      venueName,
      venueAddress,
      venueTimeArrObj,
      sports,
      price,
      venueImage,
      venueApproved
    );

    // res.status(200).json(createVenue);
    res.render("venue/createSucc", {
      title: "Venue Created",
      id: createVenue,
    });
  } catch (error) {
    res.status(500).json({ err: error });
  }
});

router.post("/search", async (req, res) => {
  const { venueName } = req.body;
  let array = [venueName];

  try {
    errorHandler.checkIfElementsExists(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    const searchResult = await venue.searchVenue(venueName);
    res.status(200).json(searchResult);
  } catch (error) {
    res.status(404).json({ err: error });
    return;
  }
});

module.exports = router;
