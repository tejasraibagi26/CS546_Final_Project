const express = require("express");
const router = express.Router();
const errorHandler = require("../Errors/errorHandler");
const data = require("../data");
const post = data.post;
const venue = data.venues;
const xss = require("xss");

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  let array = [id];
  try {
    errorHandler.checkIfElementsExists(array);
    errorHandler.checkIfElementsAreStrings(array);
    errorHandler.checkIfElementNotEmptyString(array);
    errorHandler.checkIfValidObjectId(id);
  } catch (error) {
    res.json({ status: 400, error: error });
  }

  try {
    const getPost = await post.getPostById(id);
    const getVenue = await venue.getVenueById(getPost.venueReq);

    if (getPost !== null && getVenue !== null) {
      return res.render("entry/post", {
        title: getPost.activityTitle,
        post: getPost,
        venue: getVenue,
        isLoggedIn: req.session.user,
      });
    }
  } catch (error) {
    return res.render("entry/post", {
      err: error,
      isLoggedIn: req.session.user,
    });
  }
});

module.exports = router;
