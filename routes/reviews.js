const express = require("express");
const router = express.Router();
const data = require("../data");
const resData = data.reviews;
const userData = data.user;
const venueData = data.venues;
const { ObjectId } = require("mongodb");
const errorHandler = require("../Errors/errorHandler");
const xss = require("xss");

//---------------------------------------------------------------------------------------------------------

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
    ObjectId(id);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    let rest = await resData.getReviewById(id);
    res.status(200).json(rest);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
  }
});

//---------------------------------------------------------------------------------------------------------

router.get("/", async (req, res) => {
  try {
    let resList = await resData.getAllReviews();
    res.status(200).json(resList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//---------------------------------------------------------------------------------------------------------

router.post("/text/:id/:userId/:venueId", async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  const venueId = req.params.venueId;
  const reviewText = xss(req.body.reviewText);

  let array = [id, userId, venueId];
  let inputString = [id, userId, venueId, reviewText];
  try {
    errorHandler.checkIfElementsExists(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    ObjectId(id);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(venueId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    await resData.getReviewById(id);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    await venueData.getVenueById(venueId);
  } catch (e) {
    res.status(404).json({ error: "Venue not found" });
    return;
  }
  try {
    const updatedReview = await resData.updateReviewText(
      id,
      userId,
      venueId,
      reviewText
    );
    res.redirect("/reviews/venuereviews/" + venueId);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
//---------------------------------------------------------------------------------------------------------

router.get("/getrating/:id/:userId/:venueId", async (req, res) => {
  const id = req.params.id;
  const venueId = req.params.venueId;
  const userId = req.params.userId;
  let inputString = [id, userId, venueId];

  try {
    errorHandler.checkIfElementsExists(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementNotEmptyString(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(venueId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(id);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  const review = await resData.getReviewById(id);
  const text = review.rating;
  res.render("reviews/reviewrating", {
    title: "Update Review",
    id: id,
    rating: text,
    userId: userId,
    venueId: venueId,
    isLoggedIn: req.session.user,
  });
});

router.post("/rating/:id/:userId/:venueId", async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  const venueId = req.params.venueId;

  let rating = xss(req.body.rating);
  rating = parseInt(rating);

  let array = [id, userId, venueId];
  let inputString = [id, userId, venueId, rating];
  try {
    errorHandler.checkIfElementsExists(inputString);
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
    ObjectId(id);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(venueId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    errorHandler.checkIfValidRating(rating);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    await resData.getReviewById(id);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    await venueData.getVenueById(venueId);
  } catch (e) {
    res.status(404).json({ error: "Venue not found" });
    return;
  }

  try {
    const updatedReview = await resData.updateReviewRating(
      id,
      userId,
      venueId,
      rating
    );

    res.redirect("/reviews/venuereviews/" + venueId);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//---------------------------------------------------------------------------------------------------------

router.get("/delete/:id/:userId/:venueId", async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  const venueId = req.params.venueId;

  let array = [id, userId, venueId];

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
    ObjectId(id);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(venueId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    await resData.getReviewById(id);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    await venueData.getVenueById(venueId);
  } catch (e) {
    res.status(404).json({ error: "Venue not found" });
    return;
  }
  try {
    await resData.removeReview(id, userId, venueId);
    res.redirect("/reviews/venuereviews/" + venueId);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//---------------------------------------------------------------------------------------------------------

router.get("/getinfo/:id/:userId/:venueId", async (req, res) => {
  const id = req.params.id;
  const venueId = req.params.venueId;
  const userId = req.params.userId;
  let inputString = [id, userId, venueId];
  try {
    errorHandler.checkIfElementsExists(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementNotEmptyString(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(venueId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(id);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  const review = await resData.getReviewById(id);
  const text = review.reviewText;
  res.render("reviews/reviewtext", {
    title: "Update Review",
    id: req.params.id,
    text: text,
    userId: userId,
    venueId: venueId,
    isLoggedIn: req.session.user,
  });
});

router.get("/addreview/:userId/:venueId", async (req, res) => {
  const userId = req.params.userId;
  const venueId = req.params.venueId;
  let inputString = [userId, venueId];
  try {
    errorHandler.checkIfElementsExists(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementNotEmptyString(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(venueId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  res.render("reviews/createReview", {
    title: "add Review",
    userId: userId,
    venueId: venueId,
    isLoggedIn: req.session.user,
  });
});

router.post("/:userId/:venueId", async (req, res) => {
  const userId = req.params.userId;
  const venueId = req.params.venueId;

  const reviewText = xss(req.body.reviewText);
  let rating = xss(req.body.rating);
  rating = parseInt(rating);

  let inputString = [userId, venueId, reviewText];
  let check = [userId, venueId, reviewText, rating];
  try {
    errorHandler.checkIfElementsExists(check);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(venueId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  /*try {
    errorHandler.checkIfValidRating(rating);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }*/
  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    await venueData.getVenueById(venueId);
  } catch (e) {
    res.status(404).json({ error: "Venue not found" });
    return;
  }

  try {
    const postReview = await resData.addReview(
      userId,
      venueId,
      reviewText,
      rating
    );
    res.redirect("/reviews/venuereviews/" + venueId);
  } catch (e) {
    res.render("reviews/createReview", {
      title: "Error",
      error1: e,
      userId: req.params.userId,
      venueId: req.params.venueId,
      isLoggedIn: req.session.user,
    });
  }
});

//---------------------------------------------------------------------------------------------------------

router.get("/upvote/:reviewId/:userId", async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.params.userId;

  let array = [userId, reviewId];
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
    ObjectId(reviewId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    await resData.getReviewById(reviewId);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    const updatedReview = await resData.upVote(reviewId, userId);
    res.redirect("back");
  } catch (e) {
    res.redirect("/reviews/removeup/" + reviewId + "/" + userId);
  }
});
//---------------------------------------------------------------------------------------------------------

router.get("/downvote/:reviewId/:userId", async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.params.userId;
  let array = [userId, reviewId];
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
    ObjectId(reviewId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    await resData.getReviewById(reviewId);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    const updatedReview = await resData.downVote(reviewId, userId);
    res.redirect("back");
  } catch (e) {
    res.redirect("/reviews/removedown/" + reviewId + "/" + userId);
  }
});
//---------------------------------------------------------------------------------------------------------

router.get("/removeup/:reviewId/:userId", async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.params.userId;

  let array = [userId, reviewId];
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
    ObjectId(reviewId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    await resData.getReviewById(reviewId);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    const updatedReview = await resData.removeUpvote(reviewId, userId);
    res.redirect("back");
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});
//---------------------------------------------------------------------------------------------------------

router.get("/removedown/:reviewId/:userId", async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.params.userId;
  let array = [userId, reviewId];
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
    ObjectId(reviewId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    await resData.getReviewById(reviewId);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    const updatedReview = await resData.removeDownvote(reviewId, userId);
    res.redirect("back");
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});
//---------------------------------------------------------------------------------------------------------

router.get("/newest/:venueId", async (req, res) => {
  const id = req.params.venueId;
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
    ObjectId(id);
  } catch (error) {
    res.status(400).json({ error: "venueId should be valid object ID" });
    return;
  }

  try {
    await venueData.getVenueById(id);
  } catch (e) {
    res.status(404).json({ error: "Venue not found" });
    return;
  }

  try {
    const venueReviews1 = await resData.getAllReviewsByvenueId(id);
    let mainReview;
    for (let i = 0; i < venueReviews1.length; i++) {
      if (
        venueReviews1[i].venueId === id &&
        venueReviews1[i].reviewerId === req.session.user.id
      ) {
        mainReview = venueReviews1[i];
      }
    }
    if (mainReview) {
      mainReview._id = mainReview._id.toString();
      mainReview.venueId = mainReview.reviewerId;
      let name = await userData.getUserById(req.session.user.id);
      mainReview.reviewerId = name.firstName.concat(" ", name.lastName);
    }

    const getNewest = await resData.sortNewest(id);
    for (let i = 0; i < getNewest.length; i++) {
      getNewest[i].venueId = getNewest[i].reviewerId;
      getNewest[i].reviewerId = await userData.getUserById(
        getNewest[i].reviewerId
      );
      getNewest[i].reviewerId = getNewest[i].reviewerId.firstName.concat(
        " ",
        getNewest[i].reviewerId.lastName
      );
      getNewest[i]._id = getNewest[i]._id.toString();
    }
    let venueDetails = await venueData.getVenueById(id);
    let venuename = venueDetails.venueName;
    let venueid = venueDetails._id.toString();
    let user_id = req.session.user.id;

    const user_data = await userData.getUserById(user_id.toString());
    for (let i = 0; i < user_data.upvotedReviews.length; i++) {
      for (let j = 0; j < getNewest.length; j++) {
        if (
          user_data.upvotedReviews[i].id.toString() ===
          getNewest[j]._id.toString()
        ) {
          getNewest[j].upvoted = true;
        }
      }
    }
    for (let i = 0; i < user_data.downvotedReviews.length; i++) {
      for (let j = 0; j < getNewest.length; j++) {
        if (
          user_data.downvotedReviews[i].id.toString() ===
          getNewest[j]._id.toString()
        ) {
          getNewest[j].downvoted = true;
        }
      }
    }
    res.render("reviews/filter", {
      title: "Filtered",
      venueReview: getNewest,
      venueReview1: mainReview,
      venueName: venuename,
      venueid: venueid,
      isLoggedIn: req.session.user,
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}),
  //---------------------------------------------------------------------------------------------------------

  router.get("/oldest/:venueId", async (req, res) => {
    const id = req.params.venueId;
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
      ObjectId(id);
    } catch (error) {
      res.status(400).json({ error: "venueId should be valid object ID" });
      return;
    }

    try {
      await venueData.getVenueById(id);
    } catch (e) {
      res.status(404).json({ error: "Venue not found" });
      return;
    }

    try {
      const venueReviews1 = await resData.getAllReviewsByvenueId(id);
      let mainReview;
      for (let i = 0; i < venueReviews1.length; i++) {
        if (
          venueReviews1[i].venueId === id &&
          venueReviews1[i].reviewerId === req.session.user.id
        ) {
          mainReview = venueReviews1[i];
        }
      }
      if (mainReview) {
        mainReview._id = mainReview._id.toString();
        mainReview.venueId = mainReview.reviewerId;
        let name = await userData.getUserById(req.session.user.id);
        mainReview.reviewerId = name.firstName.concat(" ", name.lastName);
      }

      const getOldest = await resData.sortOldest(id);
      for (let i = 0; i < getOldest.length; i++) {
        getOldest[i].venueId = getOldest[i].reviewerId;
        getOldest[i].reviewerId = await userData.getUserById(
          getOldest[i].reviewerId
        );
        getOldest[i].reviewerId = getOldest[i].reviewerId.firstName.concat(
          " ",
          getOldest[i].reviewerId.lastName
        );
        getOldest[i]._id = getOldest[i]._id.toString();
      }
      let venueDetails = await venueData.getVenueById(id);
      let venuename = venueDetails.venueName;
      let venueid = venueDetails._id.toString();
      let user_id = req.session.user.id;

      const user_data = await userData.getUserById(user_id.toString());
      for (let i = 0; i < user_data.upvotedReviews.length; i++) {
        for (let j = 0; j < getOldest.length; j++) {
          if (
            user_data.upvotedReviews[i].id.toString() ===
            getOldest[j]._id.toString()
          ) {
            getOldest[j].upvoted = true;
          }
        }
      }
      for (let i = 0; i < user_data.downvotedReviews.length; i++) {
        for (let j = 0; j < getOldest.length; j++) {
          if (
            user_data.downvotedReviews[i].id.toString() ===
            getOldest[j]._id.toString()
          ) {
            getOldest[j].downvoted = true;
          }
        }
      }
      res.render("reviews/filter", {
        title: "Filtered",
        venueReview: getOldest,
        venueReview1: mainReview,
        venueName: venuename,
        venueid: venueid,
        isLoggedIn: req.session.user,
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }),
  //---------------------------------------------------------------------------------------------------------

  router.get("/highest/:venueId", async (req, res) => {
    const id = req.params.venueId;
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
      ObjectId(id);
    } catch (error) {
      res.status(400).json({ error: "venueId should be valid object ID" });
      return;
    }

    try {
      await venueData.getVenueById(id);
    } catch (e) {
      res.status(404).json({ error: "Venue not found" });
      return;
    }

    try {
      const venueReviews1 = await resData.getAllReviewsByvenueId(id);
      let mainReview;
      for (let i = 0; i < venueReviews1.length; i++) {
        if (
          venueReviews1[i].venueId === id &&
          venueReviews1[i].reviewerId === req.session.user.id
        ) {
          mainReview = venueReviews1[i];
        }
      }
      if (mainReview) {
        mainReview._id = mainReview._id.toString();
        mainReview.venueId = mainReview.reviewerId;
        let name = await userData.getUserById(req.session.user.id);
        mainReview.reviewerId = name.firstName.concat(" ", name.lastName);
      }

      const getHigest = await resData.sortHighestRating(id);
      for (let i = 0; i < getHigest.length; i++) {
        getHigest[i].venueId = getHigest[i].reviewerId;
        getHigest[i].reviewerId = await userData.getUserById(
          getHigest[i].reviewerId
        );
        getHigest[i].reviewerId = getHigest[i].reviewerId.firstName.concat(
          " ",
          getHigest[i].reviewerId.lastName
        );
        getHigest[i]._id = getHigest[i]._id.toString();
      }
      let venueDetails = await venueData.getVenueById(id);
      let venuename = venueDetails.venueName;
      let venueid = venueDetails._id.toString();
      let user_id = req.session.user.id;

      const user_data = await userData.getUserById(user_id.toString());
      for (let i = 0; i < user_data.upvotedReviews.length; i++) {
        for (let j = 0; j < getHigest.length; j++) {
          if (
            user_data.upvotedReviews[i].id.toString() ===
            getHigest[j]._id.toString()
          ) {
            getHigest[j].upvoted = true;
          }
        }
      }
      for (let i = 0; i < user_data.downvotedReviews.length; i++) {
        for (let j = 0; j < getHigest.length; j++) {
          if (
            user_data.downvotedReviews[i].id.toString() ===
            getHigest[j]._id.toString()
          ) {
            getHigest[j].downvoted = true;
          }
        }
      }
      res.render("reviews/filter", {
        title: "Filtered",
        venueReview: getHigest,
        venueReview1: mainReview,
        venueName: venuename,
        venueid: venueid,
        isLoggedIn: req.session.user,
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }),
  //---------------------------------------------------------------------------------------------------------

  router.get("/lowest/:venueId", async (req, res) => {
    const id = req.params.venueId;
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
      ObjectId(id);
    } catch (error) {
      res.status(400).json({ error: "venueId should be valid object ID" });
      return;
    }

    try {
      await venueData.getVenueById(id);
    } catch (e) {
      res.status(404).json({ error: "Venue not found" });
      return;
    }

    try {
      const venueReviews1 = await resData.getAllReviewsByvenueId(id);
      let mainReview;
      for (let i = 0; i < venueReviews1.length; i++) {
        if (
          venueReviews1[i].venueId === id &&
          venueReviews1[i].reviewerId === req.session.user.id
        ) {
          mainReview = venueReviews1[i];
        }
      }
      if (mainReview) {
        mainReview._id = mainReview._id.toString();
        mainReview.venueId = mainReview.reviewerId;
        let name = await userData.getUserById(req.session.user.id);
        mainReview.reviewerId = name.firstName.concat(" ", name.lastName);
      }

      const getLowest = await resData.sortLowestRating(id);
      for (let i = 0; i < getLowest.length; i++) {
        getLowest[i].venueId = getLowest[i].reviewerId;
        getLowest[i].reviewerId = await userData.getUserById(
          getLowest[i].reviewerId
        );
        getLowest[i].reviewerId = getLowest[i].reviewerId.firstName.concat(
          " ",
          getLowest[i].reviewerId.lastName
        );
        getLowest[i]._id = getLowest[i]._id.toString();
      }
      let venueDetails = await venueData.getVenueById(id);
      let venuename = venueDetails.venueName;
      let venueid = venueDetails._id.toString();
      let user_id = req.session.user.id;

      const user_data = await userData.getUserById(user_id.toString());
      for (let i = 0; i < user_data.upvotedReviews.length; i++) {
        for (let j = 0; j < getLowest.length; j++) {
          if (
            user_data.upvotedReviews[i].id.toString() ===
            getLowest[j]._id.toString()
          ) {
            getLowest[j].upvoted = true;
          }
        }
      }
      for (let i = 0; i < user_data.downvotedReviews.length; i++) {
        for (let j = 0; j < getLowest.length; j++) {
          if (
            user_data.downvotedReviews[i].id.toString() ===
            getLowest[j]._id.toString()
          ) {
            getLowest[j].downvoted = true;
          }
        }
      }
      res.render("reviews/filter", {
        title: "Filtered",
        venueReview: getLowest,
        venueReview1: mainReview,
        venueName: venuename,
        venueid: venueid,
        isLoggedIn: req.session.user,
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }),
  //---------------------------------------------------------------------------------------------------------

  router.get("/mostupvote/:venueId", async (req, res) => {
    const id = req.params.venueId;
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
      ObjectId(id);
    } catch (error) {
      res.status(400).json({ error: "venueId should be valid object ID" });
      return;
    }

    try {
      await venueData.getVenueById(id);
    } catch (e) {
      res.status(404).json({ error: "Venue not found" });
      return;
    }

    try {
      const venueReviews1 = await resData.getAllReviewsByvenueId(id);
      let mainReview;
      for (let i = 0; i < venueReviews1.length; i++) {
        if (
          venueReviews1[i].venueId === id &&
          venueReviews1[i].reviewerId === req.session.user.id
        ) {
          mainReview = venueReviews1[i];
        }
      }
      if (mainReview) {
        mainReview._id = mainReview._id.toString();
        mainReview.venueId = mainReview.reviewerId;
        let name = await userData.getUserById(req.session.user.id);
        mainReview.reviewerId = name.firstName.concat(" ", name.lastName);
      }

      const mostUpvoted = await resData.mostUpvoted(id);
      for (let i = 0; i < mostUpvoted.length; i++) {
        mostUpvoted[i].venueId = mostUpvoted[i].reviewerId;
        mostUpvoted[i].reviewerId = await userData.getUserById(
          mostUpvoted[i].reviewerId
        );
        mostUpvoted[i].reviewerId = mostUpvoted[i].reviewerId.firstName.concat(
          " ",
          mostUpvoted[i].reviewerId.lastName
        );
        mostUpvoted[i]._id = mostUpvoted[i]._id.toString();
      }
      let venueDetails = await venueData.getVenueById(id);
      let venuename = venueDetails.venueName;
      let venueid = venueDetails._id.toString();
      let user_id = req.session.user.id;

      const user_data = await userData.getUserById(user_id.toString());
      for (let i = 0; i < user_data.upvotedReviews.length; i++) {
        for (let j = 0; j < mostUpvoted.length; j++) {
          if (
            user_data.upvotedReviews[i].id.toString() ===
            mostUpvoted[j]._id.toString()
          ) {
            mostUpvoted[j].upvoted = true;
          }
        }
      }
      for (let i = 0; i < user_data.downvotedReviews.length; i++) {
        for (let j = 0; j < mostUpvoted.length; j++) {
          if (
            user_data.downvotedReviews[i].id.toString() ===
            mostUpvoted[j]._id.toString()
          ) {
            mostUpvoted[j].downvoted = true;
          }
        }
      }
      res.render("reviews/filter", {
        title: "Filtered",
        venueReview: mostUpvoted,
        venueReview1: mainReview,
        venueName: venuename,
        venueid: venueid,
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }),
  //---------------------------------------------------------------------------------------------------------

  router.get("/mostdownvote/:venueId", async (req, res) => {
    const id = req.params.venueId;
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
      ObjectId(id);
    } catch (error) {
      res.status(400).json({ error: "venueId should be valid object ID" });
      return;
    }

    try {
      await venueData.getVenueById(id);
    } catch (e) {
      res.status(404).json({ error: "Venue not found" });
      return;
    }

    try {
      const venueReviews1 = await resData.getAllReviewsByvenueId(id);
      let mainReview;
      for (let i = 0; i < venueReviews1.length; i++) {
        if (
          venueReviews1[i].venueId === id &&
          venueReviews1[i].reviewerId === req.session.user.id
        ) {
          mainReview = venueReviews1[i];
        }
      }
      if (mainReview) {
        mainReview._id = mainReview._id.toString();
        mainReview.venueId = mainReview.reviewerId;
        let name = await userData.getUserById(req.session.user.id);
        mainReview.reviewerId = name.firstName.concat(" ", name.lastName);
      }

      const mostDownvoted = await resData.mostDownvoted(id);
      for (let i = 0; i < mostDownvoted.length; i++) {
        mostDownvoted[i].venueId = mostDownvoted[i].reviewerId;
        mostDownvoted[i].reviewerId = await userData.getUserById(
          mostDownvoted[i].reviewerId
        );
        mostDownvoted[i].reviewerId = mostDownvoted[
          i
        ].reviewerId.firstName.concat(
          " ",
          mostDownvoted[i].reviewerId.lastName
        );
        mostDownvoted[i]._id = mostDownvoted[i]._id.toString();
      }
      let venueDetails = await venueData.getVenueById(id);
      let venuename = venueDetails.venueName;
      let venueid = venueDetails._id.toString();
      let user_id = req.session.user.id;

      const user_data = await userData.getUserById(user_id.toString());
      for (let i = 0; i < user_data.upvotedReviews.length; i++) {
        for (let j = 0; j < mostDownvoted.length; j++) {
          if (
            user_data.upvotedReviews[i].id.toString() ===
            mostDownvoted[j]._id.toString()
          ) {
            mostDownvoted[j].upvoted = true;
          }
        }
      }
      for (let i = 0; i < user_data.downvotedReviews.length; i++) {
        for (let j = 0; j < mostDownvoted.length; j++) {
          if (
            user_data.downvotedReviews[i].id.toString() ===
            mostDownvoted[j]._id.toString()
          ) {
            mostDownvoted[j].downvoted = true;
          }
        }
      }
      res.render("reviews/filter", {
        title: "Filtered",
        venueReview: mostDownvoted,
        venueReview1: mainReview,
        venueName: venuename,
        venueid: venueid,
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }),
  //---------------------------------------------------------------------------------------------------------

  router.get("/filter/:venueId/:rating", async (req, res) => {
    const venueId = req.params.venueId;
    let rating = req.params.rating;
    rating = parseInt(rating);

    let array = [venueId];
    let inputString = [venueId, rating];
    try {
      errorHandler.checkIfElementsExists(inputString);
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
      errorHandler.checkIfValidRating(rating);
    } catch (error) {
      res.status(400).json({ err: error });
      return;
    }
    try {
      await venueData.getVenueById(venueId);
    } catch (e) {
      res.status(404).json({ error: "Venue not found" });
      return;
    }

    try {
      const venueReviews1 = await resData.getAllReviewsByvenueId(venueId);
      let mainReview;
      for (let i = 0; i < venueReviews1.length; i++) {
        if (
          venueReviews1[i].venueId === venueId &&
          venueReviews1[i].reviewerId === req.session.user.id
        ) {
          mainReview = venueReviews1[i];
        }
      }
      if (mainReview) {
        mainReview._id = mainReview._id.toString();
        mainReview.venueId = mainReview.reviewerId;
        let name = await userData.getUserById(req.session.user.id);
        mainReview.reviewerId = name.firstName.concat(" ", name.lastName);
      }

      const filterReview = await resData.filterReviewsByRatings(
        venueId,
        rating
      );
      for (let i = 0; i < filterReview[1].length; i++) {
        filterReview[1][i].venueId = filterReview[1][i].reviewerId;
        filterReview[1][i].reviewerId = await userData.getUserById(
          filterReview[1][i].reviewerId
        );
        filterReview[1][i].reviewerId = filterReview[1][
          i
        ].reviewerId.firstName.concat(
          " ",
          filterReview[1][i].reviewerId.lastName
        );
        filterReview[1][i]._id = filterReview[1][i]._id.toString();
      }
      let venueDetails = await venueData.getVenueById(venueId);
      let venuename = venueDetails.venueName;
      let venueid = venueDetails._id.toString();

      let user_id = req.session.user.id;

      const user_data = await userData.getUserById(user_id.toString());
      for (let i = 0; i < user_data.upvotedReviews.length; i++) {
        for (let j = 0; j < filterReview[1].length; j++) {
          if (
            user_data.upvotedReviews[i].id.toString() ===
            filterReview[1][j]._id.toString()
          ) {
            filterReview[1][j].upvoted = true;
          }
        }
      }
      for (let i = 0; i < user_data.downvotedReviews.length; i++) {
        for (let j = 0; j < filterReview[1].length; j++) {
          if (
            user_data.downvotedReviews[i].id.toString() ===
            filterReview[1][j]._id.toString()
          ) {
            filterReview[1][j].downvoted = true;
          }
        }
      }

      res.render("reviews/filter", {
        title: "Filtered",
        venueReview: filterReview[1],
        venueReview1: mainReview,
        venueName: venuename,
        venueid: venueid,
        rating: rating,
        percentage: filterReview[0],
        isLoggedIn: req.session.user,
      });
    } catch (e) {
      let venueDetails = await venueData.getVenueById(venueId);
      let venuename = venueDetails.venueName;
      res.render("reviews/filter", {
        title: "Error",
        error: e,
        venueid: venueId,
        venueName: venuename,
        isLoggedIn: req.session.user,
      });
    }
  });

//---------------------------------------------------------------------------------------------------------

router.put("/updatepicture/:id/:userId/:venueId", async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  const venueId = req.params.venueId;
  const reviewPicture = xss(req.body.reviewPicture);

  //let array = [id, userId, venueId];
  let inputString = [id, userId, venueId, reviewPicture];
  try {
    errorHandler.checkIfElementsExists(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    ObjectId(id);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(venueId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    await resData.getReviewById(id);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    await venueData.getVenueById(venueId);
  } catch (e) {
    res.status(404).json({ error: "Venue not found" });
    return;
  }
  try {
    const updatedPicture = await resData.updateReviewPicture(
      id,
      userId,
      venueId,
      reviewPicture
    );
    res.status(200).json(updatedPicture);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//---------------------------------------------------------------------------------------------------------

router.put("/deletepicture/:id/:userId/:venueId", async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  const venueId = req.params.venueId;

  //let array = [id, userId, venueId];
  let inputString = [id, userId, venueId];
  try {
    errorHandler.checkIfElementsExists(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    ObjectId(id);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }
  try {
    ObjectId(venueId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    await resData.getReviewById(id);
  } catch (e) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    await venueData.getVenueById(venueId);
  } catch (e) {
    res.status(404).json({ error: "Venue not found" });
    return;
  }
  try {
    const deletedPicture = await resData.deleteReviewPicture(
      id,
      userId,
      venueId
    );
    res.status(200).json(deletedPicture);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
//---------------------------------------------------------------------------------------------------------

router.get("/userreviews/:userId", async (req, res) => {
  const userId = req.params.userId;

  //let array = [id, userId, venueId];
  let inputString = [userId];
  try {
    errorHandler.checkIfElementsExists(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    ObjectId(userId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    await userData.getUserById(userId);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    const userReviews = await resData.getAllReviewsByUserId(userId);
    res.status(200).json(userReviews);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//---------------------------------------------------------------------------------------------------------

router.get("/venuereviews/:venueId", async (req, res) => {
  const venueId = req.params.venueId;

  //let array = [id, userId, venueId];
  let inputString = [venueId];
  try {
    errorHandler.checkIfElementsExists(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(inputString);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  try {
    ObjectId(venueId);
  } catch (error) {
    res.status(400).json({ error: "Id should be valid object ID" });
    return;
  }

  try {
    await venueData.getVenueById(venueId);
  } catch (e) {
    res.status(404).json({ error: "Venue not found" });
    return;
  }
  try {
    const venueReviews1 = await resData.getAllReviewsByvenueId(venueId);
    let mainReview;
    for (let i = 0; i < venueReviews1.length; i++) {
      if (
        venueReviews1[i].venueId === venueId &&
        venueReviews1[i].reviewerId === req.session.user.id
      ) {
        mainReview = venueReviews1[i];
      }
    }
    if (mainReview) {
      mainReview._id = mainReview._id.toString();
      mainReview.venueId = mainReview.reviewerId;
      let name = await userData.getUserById(req.session.user.id);
      mainReview.reviewerId = name.firstName.concat(" ", name.lastName);
    }

    const venueReviews = await resData.getAllReviewsByvenueId(venueId);
    for (let i = 0; i < venueReviews.length; i++) {
      venueReviews[i].reviewerId = await userData.getUserById(
        venueReviews[i].reviewerId
      );
      venueReviews[i].venue = venueReviews[i].venueId;
      venueReviews[i].venueId = req.session.user.id;
      venueReviews[i].reviewerId = venueReviews[i].reviewerId.firstName.concat(
        " ",
        venueReviews[i].reviewerId.lastName
      );
      venueReviews[i]._id = venueReviews[i]._id.toString();
    }
    let venueDetails = await venueData.getVenueById(venueId);
    let venuename = venueDetails.venueName;
    let venueid = venueDetails._id.toString();
    let user_id = req.session.user.id;

    const user_data = await userData.getUserById(user_id.toString());
    for (let i = 0; i < user_data.upvotedReviews.length; i++) {
      for (let j = 0; j < venueReviews.length; j++) {
        if (
          user_data.upvotedReviews[i].id.toString() ===
          venueReviews[j]._id.toString()
        ) {
          venueReviews[j].upvoted = true;
        }
      }
    }
    for (let i = 0; i < user_data.downvotedReviews.length; i++) {
      for (let j = 0; j < venueReviews.length; j++) {
        if (
          user_data.downvotedReviews[i].id.toString() ===
          venueReviews[j]._id.toString()
        ) {
          venueReviews[j].downvoted = true;
        }
      }
    }

    res.render("reviews/VenueReview", {
      title: "All Reviews",
      venueReview: venueReviews,
      venueReview1: mainReview,
      venueName: venuename,
      venueid: venueid,
      isLoggedIn: req.session.user,
    });
  } catch (e) {
    let venueDetails = await venueData.getVenueById(venueId);
    let venuename = venueDetails.venueName;
    res.render("reviews/VenueReview", {
      title: "All Reviews",
      error: e,
      venueid: venueId,
      venueName: venuename,
      isLoggedIn: req.session.user,
    });
  }
});

//---------------------------------------------------------------------------------------------------------
module.exports = router;
