const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const user = mongoCollections.user;
const venue = mongoCollections.venue;
const { ObjectId } = require("mongodb");
const user1 = require("./user");
const venue1 = require("./venue");
const bodyParser = require("body-parser");
const errorHandler = require("../Errors/errorHandler");

//---------------------------------------------------------------------------------------------------------

async function addReview(userId, venueId, reviewText, rating, reviewPicture) {
  const reviewCollection = await reviews();
  const userCollection = await user();
  const venueCollection = await venue();

  /* Error Handling */

  let array = [userId, venueId, reviewText, rating];
  let stringInput = [userId, venueId, reviewText];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(stringInput);
  errorHandler.checkIfElementNotEmptyString(stringInput);
  errorHandler.checkIfValidRating(rating);
  if (!reviewPicture || reviewPicture == "") {
    reviewPicture = "";
  }
  try {
    ObjectId(userId);
  } catch (error) {
    throw "User Id should be valid ObjectId";
  }

  try {
    ObjectId(venueId);
  } catch (error) {
    throw "Venue Id should be valid ObjectId";
  }

  /* Checking if user exists */

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw "User not found";

  /* Checking if venue exists */

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  /* Checking if user already reviewd to this particular venue */
  const retrivedReview = await reviewCollection.findOne({
    reviewerId: userId,
    venueId: venueId,
  });
  if (retrivedReview) {
    throw "Already reviewed";
  }

  /* Defining a new Review */

  let newReview = {
    reviewerId: userId,
    venueId: venueId,
    reviewText: reviewText,
    rating: rating,
    createdAt: new Date(),
    commentId: [],
    votes: 0,
    reviewPicture: reviewPicture,
  };

  /* Checking if review added successfully */

  const insertInfo = await reviewCollection.insertOne(newReview);
  if (insertInfo.insertedCount === 0) throw "Could not add review";

  const newId = insertInfo.insertedId;
  const review = await this.getReviewById(newId.toString());
  review._id = review._id.toString();

  /* Updating the reviews in venue collection by adding the review Id to the venue */

  const updateInfo = await venueCollection.updateOne(
    { _id: ObjectId(venueId) },
    {
      $addToSet: {
        reviews: {
          _id: review._id,
        },
      },
    }
  );

  /* Checking if review Id is added to the venue successfully */

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "adding review to venue failed";

  /* Updating the reviewId in user collection by adding the review Id to the user */

  const updateInfo1 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    {
      $addToSet: {
        reviewId: {
          _id: review._id,
        },
      },
    }
  );
  /* Checking if review Id is added to the user successfully */

  if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
    throw "adding review to user failed";

  /* Updating the overall rating of the venue whenever a new review with a rating is added */

  let overallRating1 = 0;
  let venueReviewCollection = await venue1.getVenueById(venueId);
  let length = venueReviewCollection.reviews.length;
  for (let i = 0; i < length; i++) {
    let reviewFinal = venueReviewCollection.reviews[i]._id;
    let reviewCollection1 = await getReviewById(reviewFinal);
    overallRating1 = overallRating1 + reviewCollection1.rating;
  }
  let overallRating2 = overallRating1 / length;

  const updateInfo2 = await venueCollection.updateOne(
    { _id: ObjectId(venueId) },
    {
      $set: {
        venueRating: overallRating2,
      },
    }
  );

  if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
    throw "updating venue rating failed";

  return { msg: "Review Added" };
}

//---------------------------------------------------------------------------------------------------------

async function removeReview(id, userId, venueId) {
  const reviewCollection = await reviews();
  const userCollection = await user();
  const venueCollection = await venue();

  /* Error Handling */

  let array = [id, userId, venueId];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  try {
    ObjectId(userId);
  } catch (error) {
    throw "User Id should be valid ObjectId";
  }

  try {
    ObjectId(venueId);
  } catch (error) {
    throw "Venue Id should be valid ObjectId";
  }

  try {
    ObjectId(id);
  } catch (error) {
    throw "Review ID Id should be valid ObjectId";
  }

  /* Checking if review exists */

  const reviewPosted = await getReviewById(id);
  if (!reviewPosted) {
    throw "review not found";
  }

  /* Checking if the review belongs to that particular venue or not */

  if (reviewPosted.venueId != venueId) {
    throw "review authentication failed for venue";
  }

  /* Checking if the review belongs to that particular user or not */

  if (reviewPosted.reviewerId != userId) {
    throw "review authentication failed for user";
  }

  /* Checking if user exists */

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw "User not found";

  /* Checking if venue exists */

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  let review = null;
  try {
    review = await this.getReviewById(id);
  } catch (e) {
    //Do something with error
    return;
  }

  /* Checking if review deletion was successfull ot not */

  const deletionInfo = await reviewCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete review with id of ${id}`;
  }

  /* Updating the reviews under venue whenever a review is deleted */

  const updateInfo = await venueCollection.updateOne(
    { _id: ObjectId(venueId) },
    {
      $pull: {
        reviews: {
          _id: id,
        },
      },
    }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "deleting review from venue failed";

  /* Updating the reviewId under user whenever a review is deleted */

  const updateInfo1 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    {
      $pull: {
        reviewId: {
          _id: id,
        },
      },
    }
  );
  if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
    throw "deleting review from user failed";

  /* Updating the overallrating of the venue whenever a review is deleted */

  let overallRating1 = 0;
  let venueReviewCollection = await venue1.getVenueById(venueId);
  let length = venueReviewCollection.reviews.length;
  for (let i = 0; i < length; i++) {
    let reviewFinal = venueReviewCollection.reviews[i]._id;
    let reviewCollection1 = await getReviewById(reviewFinal);
    overallRating1 = overallRating1 + reviewCollection1.rating;
  }
  let overallRating2 = overallRating1 / length;
  if (length < 1) {
    overallRating2 = 0;
  }
  const updateInfo2 = await venueCollection.updateOne(
    { _id: ObjectId(venueId) },
    {
      $set: {
        venueRating: overallRating2,
      },
    }
  );

  if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
    throw "updating venue rating failed";

  if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
    throw "deleting review from user failed";

  return { msg: "Review removed" };
}
//---------------------------------------------------------------------------------------------------------

async function updateReviewText(id, userId, venueId, reviewText) {
  const reviewCollection = await reviews();

  /* Error Handling */

  let array = [id, userId, venueId, reviewText];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  try {
    ObjectId(userId);
  } catch (error) {
    throw "User Id should be valid ObjectId";
  }

  try {
    ObjectId(venueId);
  } catch (error) {
    throw "Venue Id should be valid ObjectId";
  }

  try {
    ObjectId(id);
  } catch (error) {
    throw "Review ID Id should be valid ObjectId";
  }

  /* Checking if review exists */

  const reviewPosted = await getReviewById(id);
  if (!reviewPosted) {
    throw "review not found";
  }

  /* Checking if review belongs to that particular venue */

  if (reviewPosted.venueId != venueId) {
    throw "review authentication failed for venue";
  }

  /* Checking if review belongs to that particular user */

  if (reviewPosted.reviewerId != userId) {
    throw "review authentication failed for user";
  }
  /* Checking if user exists*/

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw "User not found";

  /* Checking if venue exists*/

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  const updatedReview = {
    reviewText: reviewText,
  };

  /* Updating the review text */

  const updatedInfo = await reviewCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedReview }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update review text successfully";
  }
  //const review = await this.getReviewById(id);
  return { msg: "Updated Review text successfully" };
}

//---------------------------------------------------------------------------------------------------------

async function updateReviewRating(id, userId, venueId, rating) {
  const userCollection = await user();
  const venueCollection = await venue();
  const reviewCollection = await reviews();

  /* Error Handling*/

  let array = [id, userId, venueId, rating];
  let stringInput = [id, userId, venueId];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(stringInput);
  errorHandler.checkIfElementNotEmptyString(stringInput);
  errorHandler.checkIfValidRating(rating);
  try {
    ObjectId(userId);
  } catch (error) {
    throw "User Id should be valid ObjectId";
  }

  try {
    ObjectId(venueId);
  } catch (error) {
    throw "Venue Id should be valid ObjectId";
  }

  try {
    ObjectId(id);
  } catch (error) {
    throw "Review ID Id should be valid ObjectId";
  }

  /* Checking if review exists */

  const reviewPosted = await getReviewById(id);
  if (!reviewPosted) {
    throw "review not found";
  }

  /* Checking if review belongs to that particular venue */

  if (reviewPosted.venueId != venueId) {
    throw "review authentication failed for venue";
  }

  /* Checking if review belongs to that particular user */

  if (reviewPosted.reviewerId != userId) {
    throw "review authentication failed for user";
  }

  /* Checking if user exists*/

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw "User not found";

  /* Checking if venue exists*/

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  /* Updating the rating of a venue */

  const updatedReview = {
    rating: rating,
  };

  const updatedInfo = await reviewCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedReview }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update review rating successfully";
  }

  /* Updating the overall rating of a venue whenever a individual review rating is updated */

  let overallRating1 = 0;
  let venueReviewCollection = await venue1.getVenueById(venueId);
  let length = venueReviewCollection.reviews.length;
  for (let i = 0; i < length; i++) {
    let reviewFinal = venueReviewCollection.reviews[i]._id;
    let reviewCollection1 = await getReviewById(reviewFinal);
    overallRating1 = overallRating1 + reviewCollection1.rating;
  }
  let overallRating2 = overallRating1 / length;

  const updateInfo2 = await venueCollection.updateOne(
    { _id: ObjectId(venueId) },
    {
      $set: {
        venueRating: overallRating2,
      },
    }
  );

  if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
    throw "updating venue rating failed";

  //const review = await this.getReviewById(id);
  return { msg: "Updated review rating successfully" };
}
//---------------------------------------------------------------------------------------------------------

async function getReviewById(id) {
  /* Error Handling */

  let array1 = [id];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(id);
  } catch (error) {
    throw "Review id should be valid ObjectId";
  }

  /* Retriving the review by its Id */

  const reviewCollection = await reviews();
  const review = await reviewCollection.findOne({ _id: ObjectId(id) });

  if (!review) throw "Review not found";
  return review;
}
//---------------------------------------------------------------------------------------------------------

async function getAllReviews() {
  /* Error Handling */

  if (Object.keys(arguments).length !== 0) {
    throw "No arguments allowed";
  }

  /* Getting all reviews from the collection */

  const reviewCollection = await reviews();
  return await reviewCollection.find({}).toArray();
}
//---------------------------------------------------------------------------------------------------------

async function addCommentToReview(reviewId, commentID) {
  // function will be called in comments.js
  const reviewCollection = await reviews();

  /* Error Handling */

  let array1 = [reviewId, commentID];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(reviewId);
  } catch (error) {
    throw "Review ID should be valid ObjectId";
  }

  try {
    ObjectId(commentID);
  } catch (error) {
    throw "Comment ID should be valid ObjectId";
  }

  /* Adding comments id to the comments in review */

  const updateInfo = await reviewCollection.updateOne(
    { _id: ObjectId(reviewId) },
    { $addToSet: { commentId: { _id: ObjectId(commentID) } } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Comment Addition failed";

  return { msg: "Comment Added" };
}

//---------------------------------------------------------------------------------------------------------
async function removeCommentFromReview(reviewId, commentID) {
  // function will be called in comments.js

  /* Error Handling */

  let array1 = [reviewId, commentID];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(reviewId);
  } catch (error) {
    throw "Review ID should be valid ObjectId";
  }

  try {
    ObjectId(commentID);
  } catch (error) {
    throw "Comment ID should be valid ObjectId";
  }

  /* Deleting comments id from the comments in review */

  const reviewCollection = await reviews();
  const updateInfo = await reviewCollection.updateOne(
    { _id: ObjectId(reviewId) },
    { $pull: { commentId: { _id: ObjectId(commentID) } } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Comment deletion failed";

  return { msg: "Comment deleted" };
}
//---------------------------------------------------------------------------------------------------------
async function upVote(reviewId, userId) {
  const userCollection = await user();
  const reviewCollection = await reviews();

  /* Error Handling */

  let array1 = [reviewId, userId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(userId);
  } catch (error) {
    throw "User Id should be valid ObjectId";
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw "Review Id should be valid ObjectId";
  }

  /* Retriving and Checking if review exists */

  const retrivedReview = await reviewCollection.findOne({
    _id: ObjectId(reviewId),
  });
  if (!retrivedReview) {
    throw "Review not found";
  }

  /* Checking if user  exists */

  let flag1, flag2, flag3, flag4;
  const retrivedUser1 = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!retrivedUser1) throw "User not found";

  /* Creating a dummy review in upvotedReviews in user which is not tied upto any user or venue or and its ID set to 0 for initial iteration */

  if (
    retrivedUser1.upvotedReviews.length === 0 &&
    retrivedUser1.downvotedReviews.length === 0
  ) {
    const updateInfo10 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedReviews: {
            id: "0",
          },
        },
      }
    );
    if (!updateInfo10.matchedCount && !updateInfo10.modifiedCount)
      throw "updating dummy _id value for upvoted Reviews failed";

    /* Creating a dummy review in downvotedReviews in user which is not tied upto any user or venue or and its ID set to 0 for initial iteration */

    const updateInfo9 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedReviews: {
            id: "0",
          },
        },
      }
    );
    if (!updateInfo9.matchedCount && !updateInfo9.modifiedCount)
      throw "updating dummy _id value for downvoted Reviews failed";
  }

  /* Retriving and checking if the user exists  */

  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!retrivedUser) {
    throw "User  not found";
  }

  /* checking if the user already upvoted that particular review  */

  for (let i = 0; i < retrivedUser.upvotedReviews.length; i++) {
    if (retrivedUser.upvotedReviews[i].id === reviewId) {
      flag3 = true;
      break;
    }
  }
  if (flag3 != true) {
    flag1 = true;
  }

  /* checking if the user already Downvoted that particular review  */

  for (let i = 0; i < retrivedUser.downvotedReviews.length; i++) {
    if (retrivedUser.downvotedReviews[i].id === reviewId) {
      flag2 = true;
      break;
    }
  }
  if (flag2 != true) {
    flag4 = true;
  }

  if (flag3 === true) {
    throw "already upvoted";
  }

  /* If user already downvoted that review and now choose to upvote then downvote is being removed and upvote is being enforced */

  if (flag1 === true && flag2 === true) {
    const updateInfo1 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $pull: {
          downvotedReviews: {
            id: reviewId,
          },
        },
      }
    );
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
      throw "removing review id from downvotedReviews failed";

    const updateInfo2 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedReviews: {
            id: reviewId,
          },
        },
      }
    );

    if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
      throw "removing review id from upvotedReviews failed";

    /* Updating overall vote count */

    let votes3 = retrivedReview.votes;
    const updateInfo3 = await reviewCollection.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $set: {
          votes: votes3 + 2,
        },
      }
    );
    if (!updateInfo3.matchedCount && !updateInfo3.modifiedCount)
      throw "Updating vote count failed";
  }

  /* If user never downvoted or upvoted that review and now choose to upvote then upvote is being enforced */

  if (flag1 === true && flag4 === true) {
    const updateInfo5 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedReviews: {
            id: reviewId,
          },
        },
      }
    );

    if (!updateInfo5.matchedCount && !updateInfo5.modifiedCount)
      throw "Adding review id to upvotedReviews failed";

    /* Updating the overall vote count */

    let votes2 = retrivedReview.votes;
    const updateInfo4 = await reviewCollection.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $set: {
          votes: votes2 + 1,
        },
      }
    );
    if (!updateInfo4.matchedCount && !updateInfo4.modifiedCount)
      throw "Updating Vote count failed";
  }
  return { msg: "Upvote Successful!" };
}
//---------------------------------------------------------------------------------------------------------

async function downVote(reviewId, userId) {
  const userCollection = await user();
  const reviewCollection = await reviews();

  /* Error Handling */
  let array1 = [reviewId, userId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(userId);
  } catch (error) {
    throw "User Id should be valid ObjectId";
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw "Review Id should be valid ObjectId";
  }

  /* Checking if review exists */

  const retrivedReview = await reviewCollection.findOne({
    _id: ObjectId(reviewId),
  });
  if (!retrivedReview) {
    throw "Review not found";
  }
  let flag1, flag2, flag3, flag4;

  /*Checking if user exists*/

  const retrivedUser1 = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!retrivedUser1) throw "User not found";

  /* Creating a dummy review in upvotedReviews in user which is not tied upto any user or venue or and its ID set to 0 for initial iteration */

  if (
    retrivedUser1.upvotedReviews.length === 0 &&
    retrivedUser1.downvotedReviews.length === 0
  ) {
    const updateInfo9 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedReviews: {
            id: "0",
          },
        },
      }
    );

    /* Creating a dummy review in downvotedReviews in user which is not tied upto any user or venue or and its ID set to 0 for initial iteration */

    if (!updateInfo9.matchedCount && !updateInfo9.modifiedCount)
      throw "updating dummy _id value for upvoted Reviews failed";
    const updateInfo10 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedReviews: {
            id: "0",
          },
        },
      }
    );
    if (!updateInfo10.matchedCount && !updateInfo10.modifiedCount)
      throw "updating dummy _id value for downvoted Reviews failed";
  }

  /* checking if the user already downvoted that particular review  */

  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  for (let i = 0; i < retrivedUser.downvotedReviews.length; i++) {
    if (retrivedUser.downvotedReviews[i].id === reviewId) {
      flag3 = true;
      break;
    }
  }
  if (flag3 != true) {
    flag1 = true;
  }
  /* checking if the user already upvoted that particular review  */

  for (let i = 0; i < retrivedUser.upvotedReviews.length; i++) {
    if (retrivedUser.upvotedReviews[i].id === reviewId) {
      flag2 = true;
      break;
    }
  }
  if (flag2 != true) {
    flag4 = true;
  }

  if (flag3 === true) {
    throw "already downvoted";
  }

  /* If user already upvoted that review and now choose to downvote then upvote is being removed and downvote is being enforced */

  if (flag1 === true && flag2 === true) {
    const updateInfo1 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $pull: {
          upvotedReviews: {
            id: reviewId,
          },
        },
      }
    );
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
      throw "Removing review id from upvotedReviews failed";

    const updateInfo2 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedReviews: {
            id: reviewId,
          },
        },
      }
    );
    if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
      throw "Adding review id to downvotedReviews failed";

    let votes = retrivedReview.votes;
    const updateInfo3 = await reviewCollection.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $set: {
          votes: votes - 2,
        },
      }
    );
    if (!updateInfo3.matchedCount && !updateInfo3.modifiedCount)
      throw "Updating vote count failed";
  }

  /* If user never downvoted or upvoted that review and now choose to downvote then downvote is being enforced */

  if (flag1 === true && flag4 === true) {
    const updateInfo5 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedReviews: {
            id: reviewId,
          },
        },
      }
    );
    if (!updateInfo5.matchedCount && !updateInfo5.modifiedCount)
      throw "Adding review id to downvotedReviews failed";

    /* Updating overall vote count */

    let votes1 = retrivedReview.votes;
    const updateInfo4 = await reviewCollection.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $set: {
          votes: votes1 - 1,
        },
      }
    );
    if (!updateInfo4.matchedCount && !updateInfo4.modifiedCount)
      throw "Updating vote count failed";
  }
  return { msg: "Downvote Successful!" };
}
//---------------------------------------------------------------------------------------------------------

async function removeUpvote(reviewId, userId) {
  const userCollection = await user();
  const reviewCollection = await reviews();

  /* Error Handling */

  let array1 = [reviewId, userId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(userId);
  } catch (error) {
    throw "User Id should be valid ObjectId";
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw "Review Id should be valid ObjectId";
  }

  /* Checking if review exists */

  const retrivedReview = await reviewCollection.findOne({
    _id: ObjectId(reviewId),
  });
  if (!retrivedReview) {
    throw "Review not found";
  }

  /* Checking if user ever upvoted the review in the first place  */

  let flag3 = "false";
  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  for (let i = 0; i < retrivedUser.upvotedReviews.length; i++) {
    if (retrivedUser.upvotedReviews[i].id === reviewId) {
      flag3 = true;
      break;
    }
  }
  if (flag3 === "false") {
    throw "Upvote authentication failed";
  }

  /* If user upvoted in the past and now choose to remove his upvote then upvote is being removed */

  if (flag3 === true) {
    const updateInfo1 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $pull: {
          upvotedReviews: {
            id: reviewId,
          },
        },
      }
    );
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
      throw "Removing review id from upvotedReviews failed";

    /* Overall vote count is being updated */

    let votes2 = retrivedReview.votes;
    const updateInfo4 = await reviewCollection.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $set: {
          votes: votes2 - 1,
        },
      }
    );
    if (!updateInfo4.matchedCount && !updateInfo4.modifiedCount)
      throw "Removing upvote failed";
  }
  return { msg: "Remove Upvote Successful!" };
}
//---------------------------------------------------------------------------------------------------------

async function removeDownvote(reviewId, userId) {
  const userCollection = await user();
  const reviewCollection = await reviews();

  /* Error Handling */

  let array1 = [reviewId, userId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(userId);
  } catch (error) {
    throw "User Id should be valid ObjectId";
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw "Review Id should be valid ObjectId";
  }

  /* Checking if review exists */

  const retrivedReview = await reviewCollection.findOne({
    _id: ObjectId(reviewId),
  });
  if (!retrivedReview) {
    throw "Review not found";
  }

  /* Checking if user ever downvoted the review in the first place  */

  let flag3 = false;
  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  for (let i = 0; i < retrivedUser.downvotedReviews.length; i++) {
    if (retrivedUser.downvotedReviews[i].id === reviewId) {
      flag3 = true;
      break;
    }
  }
  if (flag3 === false) {
    throw "Downvote authentication failed";
  }

  /* If user downvoted in the past and now choose to remove his downvote then downvote is being removed */

  if (flag3 === true) {
    const updateInfo1 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $pull: {
          downvotedReviews: {
            id: reviewId,
          },
        },
      }
    );
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
      throw "Removing review id from downvotedReviews failed";

    /* Overall vote count is being updated */

    let votes2 = retrivedReview.votes;
    const updateInfo4 = await reviewCollection.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $set: {
          votes: votes2 + 1,
        },
      }
    );
    if (!updateInfo4.matchedCount && !updateInfo4.modifiedCount)
      throw "Removing Downvote failed";
  }
  return { msg: "Remove Downvote Successful!" };
}
//---------------------------------------------------------------------------------------------------------

async function sortNewest(venueId) {
  /* Error Handling */
  let array1 = [venueId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(venueId);
  } catch (error) {
    throw "venue ID should be valid ObjectId";
  }

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  const reviewCollection = await reviews();
  const content = await venue1.getVenueById(venueId);
  if (content.reviews.length === 0) {
    throw "No reviews to filter out";
  }
  let venueReviews = [];
  const sort = { createdAt: -1 };
  let newArray = await reviewCollection.find().sort(sort).toArray();
  for (let key of newArray) {
    if (key.venueId === venueId) {
      venueReviews.push(key);
    }
  }
  return venueReviews;
}
//---------------------------------------------------------------------------------------------------------

async function sortOldest(venueId) {
  /* Error Handling */
  let array1 = [venueId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(venueId);
  } catch (error) {
    throw "venue ID should be valid ObjectId";
  }

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  const reviewCollection = await reviews();
  const content = await venue1.getVenueById(venueId);
  if (content.reviews.length === 0) {
    throw "No reviews to filter out";
  }
  let venueReviews = [];
  const sort = { createdAt: 1 };
  let newArray = await reviewCollection.find().sort(sort).toArray();
  for (let key of newArray) {
    if (key.venueId === venueId) {
      venueReviews.push(key);
    }
  }
  return venueReviews;
}
//---------------------------------------------------------------------------------------------------------

async function sortHighestRating(venueId) {
  /* Error Handling */
  let array1 = [venueId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(venueId);
  } catch (error) {
    throw "venue ID should be valid ObjectId";
  }

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  const reviewCollection = await reviews();
  const content = await venue1.getVenueById(venueId);
  if (content.reviews.length === 0) {
    throw "No reviews to filter out";
  }
  let venueReviews = [];
  const sort = { rating: -1 };
  let newArray = await reviewCollection.find().sort(sort).toArray();
  for (let key of newArray) {
    if (key.venueId === venueId) {
      venueReviews.push(key);
    }
  }
  return venueReviews;
}

//---------------------------------------------------------------------------------------------------------

async function sortLowestRating(venueId) {
  /* Error Handling */
  let array1 = [venueId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(venueId);
  } catch (error) {
    throw "venue ID should be valid ObjectId";
  }

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  const reviewCollection = await reviews();
  const content = await venue1.getVenueById(venueId);
  if (content.reviews.length === 0) {
    throw "No reviews to filter out";
  }
  let venueReviews = [];
  const sort = { rating: 1 };
  let newArray = await reviewCollection.find().sort(sort).toArray();
  for (let key of newArray) {
    if (key.venueId === venueId) {
      venueReviews.push(key);
    }
  }
  return venueReviews;
}

//---------------------------------------------------------------------------------------------------------

async function filterReviewsByRatings(venueId, rating) {
  const reviewCollection = await reviews();
  /* Error Handling */
  let array2 = [venueId];
  let array = [venueId, rating];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array2);
  errorHandler.checkIfElementNotEmptyString(array2);
  try {
    ObjectId(venueId);
  } catch (error) {
    throw "venue ID should be valid ObjectId";
  }

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  errorHandler.checkIfValidRating(rating);
  const content = await venue1.getVenueById(venueId);
  if (content.reviews.length === 0) {
    throw "No reviews to filter out";
  }
  const sort = { rating: 1 };
  const filter = await reviewCollection
    .find({ rating: { $gte: rating } })
    .sort(sort)
    .toArray();

  let venueReviews = [];
  for (let key of filter) {
    if (key.venueId === venueId) {
      venueReviews.push(key);
    }
  }

  if (venueReviews.length === 0) {
    throw "No reviews to filter out with the preferred rating";
  }
  let percentage = (venueReviews.length / content.reviews.length) * 100;
  let array1 = [];
  array1.push(percentage);
  array1.push(venueReviews);
  return array1;
}

//---------------------------------------------------------------------------------------------------------

async function mostUpvoted(venueId) {
  /* Error Handling */
  let array1 = [venueId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(venueId);
  } catch (error) {
    throw "venue ID should be valid ObjectId";
  }

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  const reviewCollection = await reviews();
  const content = await venue1.getVenueById(venueId);
  if (content.reviews.length === 0) {
    throw "No reviews to filter out";
  }
  let venueReviews = [];
  const sort = { votes: -1 };
  let newArray = await reviewCollection.find().sort(sort).toArray();
  for (let key of newArray) {
    if (key.venueId === venueId) {
      venueReviews.push(key);
    }
  }
  return venueReviews;
}
//---------------------------------------------------------------------------------------------------------

async function mostDownvoted(venueId) {
  /* Error Handling */
  let array1 = [venueId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(venueId);
  } catch (error) {
    throw "venue ID should be valid ObjectId";
  }

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  const reviewCollection = await reviews();
  const content = await venue1.getVenueById(venueId);
  if (content.reviews.length === 0) {
    throw "No reviews to filter out";
  }
  let venueReviews = [];
  const sort = { votes: 1 };
  let newArray = await reviewCollection.find().sort(sort).toArray();
  for (let key of newArray) {
    if (key.venueId === venueId) {
      venueReviews.push(key);
    }
  }
  return venueReviews;
}
//---------------------------------------------------------------------------------------------------------
async function updateReviewPicture(id, userId, venueId, reviewPicture) {
  const userCollection = await user();
  const venueCollection = await venue();
  const reviewCollection = await reviews();
  /* Error Handling */

  let array = [id, userId, venueId, reviewPicture];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  try {
    ObjectId(userId);
  } catch (error) {
    throw "User Id should be valid ObjectId";
  }

  try {
    ObjectId(venueId);
  } catch (error) {
    throw "Venue Id should be valid ObjectId";
  }

  try {
    ObjectId(id);
  } catch (error) {
    throw "Review ID Id should be valid ObjectId";
  }

  /* Checking if user exists */
  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw "User not found";

  /* Checking if venue exists*/

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  /* Checking if review exists*/
  const reviewPosted = await getReviewById(id);
  if (!reviewPosted) {
    throw "review not found";
  }

  /* Checking if review belongs to that particular venue */

  if (reviewPosted.venueId != venueId) {
    throw "review authentication failed for venue";
  }

  /* Checking if review belongs to that particular user */

  if (reviewPosted.reviewerId != userId) {
    throw "review authentication failed for user";
  }

  const updatedReview = {
    reviewPicture: reviewPicture,
  };

  /* Updating the review text */

  const updatedInfo = await reviewCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedReview }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update review picture successfully";
  }
  //const review = await this.getReviewById(id);
  return { msg: "Updated Review picture successfully" };
}

//---------------------------------------------------------------------------------------------------------

async function deleteReviewPicture(id, userId, venueId) {
  const userCollection = await user();
  const venueCollection = await venue();
  const reviewCollection = await reviews();
  /* Error Handling */

  let array = [id, userId, venueId];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  try {
    ObjectId(userId);
  } catch (error) {
    throw "User Id should be valid ObjectId";
  }

  try {
    ObjectId(venueId);
  } catch (error) {
    throw "Venue Id should be valid ObjectId";
  }

  try {
    ObjectId(id);
  } catch (error) {
    throw "Review ID Id should be valid ObjectId";
  }
  /* Checking if user exists*/

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw "User not found";

  /* Checking if venue exists */

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  /* Checking if review exists */

  const reviewPosted = await getReviewById(id);
  if (!reviewPosted) {
    throw "review not found";
  }

  /* Checking if review belongs to that particular venue */

  if (reviewPosted.venueId != venueId) {
    throw "review authentication failed for venue";
  }

  /* Checking if review belongs to that particular user */

  if (reviewPosted.reviewerId != userId) {
    throw "review authentication failed for user";
  }

  const updatedReview = {
    reviewPicture: "",
  };

  /* Updating the review text */

  const updatedInfo = await reviewCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedReview }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not delete review picture successfully";
  }
  //const review = await this.getReviewById(id);
  return { msg: "Deleted Review picture successfully" };
}

//---------------------------------------------------------------------------------------------------------

async function getAllReviewsByUserId(userId) {
  /* Error Handling */
  let array1 = [userId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(userId);
  } catch (error) {
    throw "user ID should be valid ObjectId";
  }
  /* Checking if user exists*/

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw "User not found";

  let reviewArray = [];
  let userReviewCollection = await user1.getUserById(userId);
  let length = userReviewCollection.reviewId.length;
  if (length === 0) {
    throw "No reviews";
  }
  for (let i = 0; i < length; i++) {
    let reviewFinal = userReviewCollection.reviewId[i]._id;
    let reviewCollection1 = await getReviewById(reviewFinal);
    reviewArray.push(reviewCollection1);
  }
  return reviewArray;
}

//---------------------------------------------------------------------------------------------------------
async function getAllReviewsByvenueId(venueId) {
  /* Error Handling */
  let array1 = [venueId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(venueId);
  } catch (error) {
    throw "venue ID should be valid ObjectId";
  }

  /* Checking if venue exists */

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw "Venue not found";

  let reviewArray = [];
  let venueReviewCollection = await venue1.getVenueById(venueId);
  let length = venueReviewCollection.reviews.length;
  if (length === 0) {
    throw "no reviews";
  }
  for (let i = 0; i < length; i++) {
    let reviewFinal = venueReviewCollection.reviews[i]._id;
    let reviewCollection1 = await getReviewById(reviewFinal);
    reviewArray.push(reviewCollection1);
  }
  return reviewArray;
}
//---------------------------------------------------------------------------------------------------------
module.exports = {
  addReview,
  removeReview,
  updateReviewText,
  updateReviewRating,
  getAllReviews,
  getReviewById,
  removeCommentFromReview,
  addCommentToReview,
  upVote,
  downVote,
  removeUpvote,
  removeDownvote,
  sortNewest,
  sortOldest,
  sortHighestRating,
  sortLowestRating,
  filterReviewsByRatings,
  mostUpvoted,
  mostDownvoted,
  updateReviewPicture,
  deleteReviewPicture,
  getAllReviewsByUserId,
  getAllReviewsByvenueId,
};
