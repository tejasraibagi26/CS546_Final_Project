const express = require("express");
const router = express.Router();
const data = require("../data");
const errorHandler = require("../Errors/errorHandler");
const venue = data.venues;
const review = data.reviews;
const user = data.user;
const multer = require("multer");
const xss = require("xss");

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
        isLoggedIn: req.session.user ? true : false,
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
        isLoggedIn: req.session.user ? true : false,
      });
      return;
    } catch (error) {
      res.status(404).render("venue/searchResult", {
        title: "Search Result",
        err: true,
        error: error,
        searchTerm,
        isLoggedIn: req.session.user ? true : false,
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
      isLoggedIn: req.session.user ? true : false,
    });
    return;
  } catch (error) {
    res.status(404).render("venue/searchResult", {
      title: "Search Result",
      err: true,
      error: error,
      searchTerm,
      isLoggedIn: req.session.user ? true : false,
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
    let getReviews = await review.getAllReviewsByvenueId(id);

    let maxReviews = 5;
    if (getReviews.length > maxReviews) {
      getReviews = getReviews.slice(0, maxReviews);
    }
    for (let i = 0; i < getReviews.length; i++) {
      const username = await user.getUserById(getReviews[i].reviewerId);
      let reviewUser = `${username.firstName} ${username.lastName}`;
      getReviews[i].username = reviewUser;
      getReviews[i].userId = getReviews[i].reviewerId;
    }

    res.status(200).render("venue/venuePage", {
      title: getVenue.venueName,
      venue: getVenue,
      reviews: getReviews,
      reviewCount: getVenue.reviews.length,
      isLoggedIn: req.session.user ? true : false,
      userId: req.session.user ? req.session.user.id : "",
    });
  } catch (error) {
    res.status(404).json({ err: error });
  }
});

router.post("/create", upload.single("venueImage"), async (req, res) => {
  let venueName = xss(req.body.venueName);
  let venueAddress = xss(req.body.venueAddress);
  let venueTimings = xss(req.body.venueTimings);
  let venueSlots = xss(req.body.venueSlots);
  let sports = xss(req.body.sports);
  let price = xss(req.body.price);
  let venueImage = xss(req.file.filename);
  let venueTimeArrObj = [];
  let venueApproved = false;

  venueTimings = venueTimings.split(",");
  sports = sports.split(",");
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

    res.render("venue/createSucc", {
      title: "Venue Created",
      id: createVenue,
      isLoggedIn: req.session.user ? true : false,
    });
  } catch (error) {
    res.status(500).json({ err: error });
  }
});

router.post("/search", async (req, res) => {
  let venueName = xss(req.body.venueName);
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

router.post("/:id/book", async (req, res) => {
  const bookingUserId = xss(req.body.bookingUserId);
  const bookedVenueId = req.params.id;
  const startTime = xss(req.body.startTime);
  const endTime = xss(req.body.endTime);
  const date = xss(req.body.date);

  let array = [bookingUserId, bookedVenueId, timing, date];
  try {
    errorHandler.checkIfElementsExists(array);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfValidObjectId(bookingUserId);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfValidObjectId(bookedVenueId);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfCurrentDate(date);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfTimePeriodValid(startTime, endTime);
  } catch (error) {
    return res.status(400).json({ error: error });
  }

  try {
    const booking = await booking.create(
      bookingUserId,
      bookedVenueId,
      startTime,
      endTime,
      date
    );
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;
