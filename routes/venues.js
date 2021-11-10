const express = require("express");
const router = express.Router();
const data = require("../data");
const errorHandler = require("../Errors/errorHandler");
const venue = data.venues;

router.get("/", async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const min = parseInt(req.query.min);
  const max = parseInt(req.query.max);
  let array = [searchTerm];

  if (!searchTerm) {
    try {
      const getVenues = await venue.getAllVenues();
      res.render("venue/searchResult", {
        title: "Search Results",
        venues: getVenues,
        count: getVenues.length,
      });
      return;
    } catch (error) {
      res.status(500).json({ err: error });
      return;
    }
  } else if (min && max && searchTerm) {
    try {
      const fetchVenue = await venue.searchVenue(searchTerm, min, max);
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
    const fetchVenue = await venue.searchVenue(searchTerm);
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

router.post("/create", async (req, res) => {
  const { venueName, venueAddress, venueTimings } = req.body;
  let array = [venueName, venueAddress, venueTimings];

  try {
    errorHandler.checkIfElementsExists(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  array = [venueName, venueAddress];

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
    errorHandler.checkIfValidArrayObject(venueTimings);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    const createVenue = await venue.createNewVenue(
      venueName,
      venueAddress,
      venueTimings
    );

    res.status(200).json(createVenue);
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
