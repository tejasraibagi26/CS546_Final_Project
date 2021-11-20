const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const user = mongoCollections.user;
const venue = mongoCollections.venue;
const { ObjectId } = require('mongodb');
const user1 = require('./user');
const venue1 = require('./venue');
//var bodyParser = require('body-parser');

//app.use(bodyParser());


//---------------------------------------------------------------------------------------------------------


async function addReview(userId, venueId, reviewText, rating) {
  const reviewCollection = await reviews();
  const userCollection = await user();
  const venueCollection = await venue();

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw 'User not found';

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw 'Venue not found';


  if (!userId || !venueId || !reviewText || !rating) {
    throw 'All fields need to have valid values';
  }

  if (typeof (userId) != 'string') {
    throw 'User ID should be a string';
  }

  if (typeof (venueId) != 'string') {
    throw 'Venue ID should be a string';
  }

  if (typeof (reviewText) != 'string') {
    throw 'Review Text should be a string';
  }

  if (typeof (rating) != 'number') {
    throw 'rating should be a number'
  }
  if (rating < 0 || rating > 5) {
    throw 'rating value should be in between 0 to 5';
  }

  if (userId.length === 0) {
    throw 'User ID cannot be a empty string';
  }

  if (venueId.length === 0) {
    throw 'Venue ID cannot be a empty string';
  }

  if (reviewText.length === 0) {
    throw 'Review text cannot be a empty string';
  }

  if (userId.trim().length === 0) {
    throw 'User ID cannot be just empty spaces';
  }

  if (venueId.trim().length === 0) {
    throw 'Venue ID cannot be just empty spaces';
  }

  if (reviewText.trim().length === 0) {
    throw 'Review Text cannot be just empty spaces';
  }

  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(venueId);
  } catch (error) {
    throw 'Venue Id should be valid ObjectId';
  }

  let newReview = {
    _id: ObjectId(),
    reviewerId: userId,
    venueId: venueId,
    reviewText: reviewText,
    rating: rating,
    commentId: [],
    votes: 0,

  };

  const insertInfo = await reviewCollection.insertOne(newReview);
  if (insertInfo.insertedCount === 0) throw 'Could not add review';

  const newId = insertInfo.insertedId;
  const review = await this.getReviewById(newId.toString());
  review._id = review._id.toString();


  const updateInfo = await venueCollection.updateOne(
    { _id: ObjectId(venueId) },
    {
      $addToSet: {
        reviews: {
          _id: review._id
        }
      }
    }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'adding review to venue failed';

  const updateInfo1 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    {
      $addToSet: {
        reviewId: {
          _id: review._id
        }
      }
    }
  );

  if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
    throw 'adding review to user failed';

  let overallRating1 = 0;
  let reviewCollection1 = await getAllReviews();
  let length = reviewCollection1.length;
  for (let i = 0; i < length; i++) {
    overallRating1 = overallRating1 + reviewCollection1[i].rating;
  }
  let overallRating2 = overallRating1 / length;

  const updateInfo2 = await venueCollection.updateOne(
    { _id: ObjectId(venueId) },
    {
      $set: {
        venueRating: overallRating2
      }
    });

  if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
    throw 'updating venue rating failed';


  return { msg: "Review Added" };
}

//---------------------------------------------------------------------------------------------------------

async function removeReview(id, userId, venueId) {
  const reviewCollection = await reviews();
  const userCollection = await user();
  const venueCollection = await venue();

  const reviewPosted = await getReviewById(id);
  if (!reviewPosted) {
    throw 'review not found';
  }

  if (reviewPosted.venueId != venueId) {
    throw 'review authentication failed for venue';
  }

  if (reviewPosted.reviewerId != userId) {
    throw 'review authentication failed for user';
  }

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw 'User not found';

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw 'Venue not found';

  if (!userId || !venueId || !id) {
    throw 'All fields need to have valid values';
  }

  if (typeof (userId) != 'string') {
    throw 'User ID should be a string';
  }

  if (typeof (venueId) != 'string') {
    throw 'Venue ID should be a string';
  }

  if (typeof (id) != 'string') {
    throw 'Review ID should be a string';
  }

  if (userId.length === 0) {
    throw 'User ID cannot be a empty string';
  }

  if (venueId.length === 0) {
    throw 'Venue ID cannot be a empty string';
  }

  if (id.length === 0) {
    throw 'Review ID cannot be a empty string';
  }

  if (userId.trim().length === 0) {
    throw 'User ID cannot be just empty spaces';
  }

  if (venueId.trim().length === 0) {
    throw 'Venue ID cannot be just empty spaces';
  }

  if (id.trim().length === 0) {
    throw 'Review ID cannot be just empty spaces';
  }

  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(venueId);
  } catch (error) {
    throw 'Venue Id should be valid ObjectId';
  }

  try {
    ObjectId(id);
  } catch (error) {
    throw 'Review ID Id should be valid ObjectId';
  }

  let review = null;
  try {
    review = await this.getReviewById((id));
  } catch (e) {
    console.log(e);
    return;
  }
  const deletionInfo = await reviewCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete review with id of ${id}`;
  }


  const updateInfo = await venueCollection.updateOne(
    { _id: ObjectId(venueId) },
    {
      $pull: {
        reviews: {
          _id: id
        }
      }
    }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'deleting review from venue failed';

  const updateInfo1 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    {
      $pull: {
        reviewId: {
          _id: id
        }
      }
    }
  );
  if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
    throw 'deleting review from user failed';



  let overallRating1 = 0;
  let reviewCollection1 = await getAllReviews();
  let length = reviewCollection1.length;
  let overallRating2;

  for (let i = 0; i < length; i++) {
    overallRating1 = overallRating1 + reviewCollection1[i].rating;
  }
  overallRating2 = overallRating1 / length;
  if (length < 1) {
    overallRating2 = 0;
  }
  const updateInfo2 = await venueCollection.updateOne(
    { _id: ObjectId(venueId) },
    {
      $set: {
        venueRating: overallRating2
      }
    });
  if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
    throw 'deleting review from user failed';


  return { msg: "Review removed" };
}

//---------------------------------------------------------------------------------------------------------

async function updateReviewText(id, userId, venueId, reviewText) {
  const reviewCollection = await reviews();

  const reviewPosted = await getReviewById(id);
  if (!reviewPosted) {
    throw 'review not found';
  }

  if (reviewPosted.venueId != venueId) {
    throw 'review authentication failed for venue';
  }

  if (reviewPosted.reviewerId != userId) {
    throw 'review authentication failed for user';
  }
  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw 'User not found';

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw 'Venue not found';

  if (!userId || !venueId || !id || !reviewText) {
    throw 'All fields need to have valid values';
  }

  if (typeof (userId) != 'string') {
    throw 'User ID should be a string';
  }

  if (typeof (venueId) != 'string') {
    throw 'Venue ID should be a string';
  }

  if (typeof (id) != 'string') {
    throw 'Review ID should be a string';
  }

  if (typeof (reviewText) != 'string') {
    throw 'Review text should be a string';
  }

  if (userId.length === 0) {
    throw 'User ID cannot be a empty string';
  }

  if (venueId.length === 0) {
    throw 'Venue ID cannot be a empty string';
  }

  if (id.length === 0) {
    throw 'Review ID cannot be a empty string';
  }

  if (reviewText.length === 0) {
    throw 'Review text cannot be a empty string';
  }

  if (userId.trim().length === 0) {
    throw 'User ID cannot be just empty spaces';
  }

  if (venueId.trim().length === 0) {
    throw 'Venue ID cannot be just empty spaces';
  }

  if (id.trim().length === 0) {
    throw 'Review ID cannot be just empty spaces';
  }

  if (reviewText.trim().length === 0) {
    throw 'Review text cannot be just empty spaces';
  }

  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(venueId);
  } catch (error) {
    throw 'Venue Id should be valid ObjectId';
  }

  try {
    ObjectId(id);
  } catch (error) {
    throw 'Review ID Id should be valid ObjectId';
  }

  const updatedReview = {
    reviewText: reviewText,
  };


  const updatedInfo = await reviewCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedReview }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw 'could not update review text successfully';
  }
  const review = await this.getReviewById(id);
  return { msg: "Updated Review text successfully" };
}

//---------------------------------------------------------------------------------------------------------

async function updateReviewRating(id, userId, venueId, rating) {
  const userCollection = await user();
  const venueCollection = await venue();
  const reviewCollection = await reviews();

  const reviewPosted = await getReviewById(id);
  if (!reviewPosted) {
    throw 'review not found';
  }

  if (reviewPosted.venueId != venueId) {
    throw 'review authentication failed for venue';
  }

  if (reviewPosted.reviewerId != userId) {
    throw 'review authentication failed for user';
  }

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw 'User not found';

  const venueThatGotPosted = await venue1.getVenueById(venueId);
  if (!venueThatGotPosted) throw 'Venue not found';

  if (!userId || !venueId || !id || !rating) {
    throw 'All fields need to have valid values';
  }

  if (typeof (userId) != 'string') {
    throw 'User ID should be a string';
  }

  if (typeof (venueId) != 'string') {
    throw 'Venue ID should be a string';
  }

  if (typeof (id) != 'string') {
    throw 'Review ID should be a string';
  }

  if (typeof (rating) != 'number') {
    throw 'rating should be a number'
  }


  if (userId.length === 0) {
    throw 'User ID cannot be a empty string';
  }

  if (venueId.length === 0) {
    throw 'Venue ID cannot be a empty string';
  }

  if (id.length === 0) {
    throw 'Review ID cannot be a empty string';
  }

  if (rating < 0 || rating > 5) {
    throw 'rating value should be in between 0 to 5';
  }

  if (userId.trim().length === 0) {
    throw 'User ID cannot be just empty spaces';
  }

  if (venueId.trim().length === 0) {
    throw 'Venue ID cannot be just empty spaces';
  }

  if (id.trim().length === 0) {
    throw 'Review ID cannot be just empty spaces';
  }


  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(venueId);
  } catch (error) {
    throw 'Venue Id should be valid ObjectId';
  }

  try {
    ObjectId(id);
  } catch (error) {
    throw 'Review ID Id should be valid ObjectId';
  }

  const updatedReview = {
    rating: rating
  };


  const updatedInfo = await reviewCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedReview }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw 'could not update review rating successfully';
  }


  let overallRating1 = 0;
  let reviewCollection1 = await getAllReviews();
  let length = reviewCollection1.length;
  for (let i = 0; i < length; i++) {
    overallRating1 = overallRating1 + reviewCollection1[i].rating;
  }
  let overallRating2 = overallRating1 / length;

  const updateInfo2 = await venueCollection.updateOne(
    { _id: ObjectId(venueId) },
    {
      $set: {
        venueRating: overallRating2
      }
    });

  if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
    throw 'updating venue rating failed';

  const review = await this.getReviewById(id);
  return { msg: "Updated review rating successfully" };
}
//---------------------------------------------------------------------------------------------------------

async function getReviewById(id) {


  if (!id) {
    throw 'Review ID need to be provided';
  }

  if (typeof (id) != 'string') {
    throw 'Review ID should be a string';
  }

  if (id.length === 0) {
    throw 'Review ID cannot be a empty string';
  }


  if (id.trim().length === 0) {
    throw 'Review ID cannot be just empty spaces';
  }


  try {
    ObjectId(id);
  } catch (error) {
    throw 'Review id should be valid ObjectId';
  }

  const reviewCollection = await reviews();
  const review = await reviewCollection.findOne({ _id: ObjectId(id) });

  if (!review) throw 'Review not found';
  return review;
}

//---------------------------------------------------------------------------------------------------------

async function getAllReviews() {

  if (Object.keys(arguments).length !== 0) {
    throw "No arguments allowed";
  }

  const reviewCollection = await reviews();
  return await reviewCollection.find({}).toArray();
}
//---------------------------------------------------------------------------------------------------------

async function addCommentToReview(reviewId, commentID) { // function will be called in comments.js
  const reviewCollection = await reviews();


  if (!reviewId || !commentID) {
    throw 'All fields need to have valid values';
  }

  if (typeof (reviewId) != 'string') {
    throw 'Review ID should be a string';
  }

  if (typeof (commentID) != 'string') {
    throw 'Comment ID should be a string';
  }

  if (reviewId.length === 0) {
    throw 'Review ID cannot be a empty string';
  }

  if (commentID.length === 0) {
    throw 'Comment ID cannot be a empty string';
  }

  if (reviewId.trim().length === 0) {
    throw 'Comment ID cannot be just empty spaces';
  }

  if (commentID.trim().length === 0) {
    throw 'Comment ID cannot be just empty spaces';
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw 'Review ID should be valid ObjectId';
  }

  try {
    ObjectId(commentID);
  } catch (error) {
    throw 'Comment ID should be valid ObjectId';
  }


  const updateInfo = await reviewCollection.updateOne(
    { _id: ObjectId(reviewId) },
    { $addToSet: { commentsId: { _id: ObjectId(commentID) } } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Comment Addition failed';

  return { msg: "Comment Added" };
}


//---------------------------------------------------------------------------------------------------------
async function removeCommentFromReview(reviewId, commentID) { // function will be called in comments.js

  if (!reviewId || !commentID) {
    throw 'All fields need to have valid values';
  }

  if (typeof (reviewId) != 'string') {
    throw 'Review ID should be a string';
  }

  if (typeof (commentID) != 'string') {
    throw 'Comment ID should be a string';
  }
  if (reviewId.length === 0) {
    throw 'Review ID cannot be a empty string';
  }

  if (commentID.length === 0) {
    throw 'Comment ID cannot be a empty string';
  }
  if (reviewId.trim().length === 0) {
    throw 'Comment ID cannot be just empty spaces';
  }

  if (commentID.trim().length === 0) {
    throw 'Comment ID cannot be just empty spaces';
  }
  try {
    ObjectId(reviewId);
  } catch (error) {
    throw 'Review ID should be valid ObjectId';
  }

  try {
    ObjectId(commentID);
  } catch (error) {
    throw 'Comment ID should be valid ObjectId';
  }


  const reviewCollection = await reviews();
  const updateInfo = await reviewCollection.updateOne(
    { _id: ObjectId(reviewId) },
    { $pull: { commentsId: { _id: ObjectId(commentID) } } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Comment deletion failed';

  return { msg: "Comment deleted" };
}


async function upVote(reviewId, userId) {
  const userCollection = await user();
  const reviewCollection = await reviews();




  if (!userId || !reviewId ) {
    throw 'All fields need to have valid values';
  }

  if (typeof (reviewId) != 'string') {
    throw 'Review ID should be a string';
  }
  if (typeof (userId) != 'string') {
    throw 'User ID should be a string';
  }

  if (reviewId.length === 0) {
    throw 'Review ID cannot be a empty string';
  }

  if (userId.length === 0) {
    throw 'User ID cannot be a empty string';
  }

  if (reviewId.trim().length === 0) {
    throw 'Review ID cannot be just empty spaces';
  }

  if (userId.trim().length === 0) {
    throw 'User ID cannot be just empty spaces';
  }
  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw 'Review Id should be valid ObjectId';
  }

  const retrivedReview = await reviewCollection.findOne({ _id: ObjectId(reviewId) });
  if (!retrivedReview){
  throw 'Review not found';
  }

  let flag1, flag2, flag3, flag4;
  const retrivedUser1 = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!retrivedUser1) throw 'User not found';

  if (retrivedUser1.upvotedReviews.length === 0 && retrivedUser1.downvotedReviews.length === 0) {
    const updateInfo10 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedReviews: {
            id: "0"
          }
        }
      }
    );
    if (!updateInfo10.matchedCount && !updateInfo10.modifiedCount)
    throw 'updating dummy _id value for upvoted Reviews failed';

    const updateInfo9 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedReviews: {
            id: "0"
          }
        }
      }
    );
    if (!updateInfo9.matchedCount && !updateInfo9.modifiedCount)
  throw 'updating dummy _id value for downvoted Reviews failed';
  }
  

  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  for (let i = 0; i < retrivedUser.upvotedReviews.length; i++) {
    console.log(retrivedUser.upvotedReviews.length);
    if (retrivedUser.upvotedReviews[i].id === reviewId) {
      flag3 = "true";
      break;
    }
  }
  if (flag3 != "true") {
    flag1 = "true";
  }

  for (let i = 0; i < retrivedUser.downvotedReviews.length; i++) {
    if (retrivedUser.downvotedReviews[i].id === reviewId) {
      flag2 = "true";
      break;
    }
  }
  if (flag2 != "true") {
    flag4 = "true";
  }

  if (flag3 === "true") {
    throw "already upvoted";
  }


  if (flag1 === "true" && flag2 === "true") {
    const updateInfo1 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $pull: {
          downvotedReviews: {

            id: reviewId
          }
        }
      }
    );
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
    throw 'removing review id from downvotedReviews failed';


    const updateInfo2 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedReviews: {

            id: reviewId
          }
        }
      }
    );

    if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
    throw 'removing review id from upvotedReviews failed';

    let votes3 = retrivedReview.votes;
    const updateInfo3 = await reviewCollection.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $set: {
          votes: votes3 + 2
        }
      }
    );
    if (!updateInfo3.matchedCount && !updateInfo3.modifiedCount)
    throw 'Updating vote count failed';
  }

  


  if (flag1 === "true" && flag4 === "true") {
    const updateInfo5 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedReviews: {

            id: reviewId
          }
        }
      }
    );

    if (!updateInfo5.matchedCount && !updateInfo5.modifiedCount)
    throw 'Adding review id to upvotedReviews failed';

    let votes2 = retrivedReview.votes;
    const updateInfo4 = await reviewCollection.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $set: {
          votes: votes2 + 1
        }
      }
    );
    if (!updateInfo4.matchedCount && !updateInfo4.modifiedCount)
    throw 'Updating Vote count failed';
  }
 
  return { msg: "Upvote Successful!" }

}

//---------------------------------------------------------------------------------------------------------

async function downVote(reviewId, userId) {
  const userCollection = await user();
  const reviewCollection = await reviews();


  if (!userId || !reviewId ) {
    throw 'All fields need to have valid values';
  }

  if (typeof (reviewId) != 'string') {
    throw 'Review ID should be a string';
  }
  if (typeof (userId) != 'string') {
    throw 'User ID should be a string';
  }

  if (reviewId.length === 0) {
    throw 'Review ID cannot be a empty string';
  }

  if (userId.length === 0) {
    throw 'User ID cannot be a empty string';
  }

  if (reviewId.trim().length === 0) {
    throw 'Review ID cannot be just empty spaces';
  }

  if (userId.trim().length === 0) {
    throw 'User ID cannot be just empty spaces';
  }
  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw 'Review Id should be valid ObjectId';
  }


  const retrivedReview = await reviewCollection.findOne({ _id: ObjectId(reviewId) });
  if (!retrivedReview){
    throw 'Review not found';
    }
  let flag1, flag2, flag3, flag4;
  const retrivedUser1 = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!retrivedUser1) throw 'User not found';
  if (retrivedUser1.upvotedReviews.length === 0 && retrivedUser1.downvotedReviews.length === 0) {
    const updateInfo9 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedReviews: {
            id: "0"
          }
        }
      }
    );
    if (!updateInfo9.matchedCount && !updateInfo9.modifiedCount)
    throw 'updating dummy _id value for upvoted Reviews failed';
    const updateInfo10 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedReviews: {
            id: "0"
          }
        }
      }
    );
    if (!updateInfo10.matchedCount && !updateInfo10.modifiedCount)
    throw 'updating dummy _id value for downvoted Reviews failed';
  }
  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  for (let i = 0; i < retrivedUser.downvotedReviews.length; i++) {
    if (retrivedUser.downvotedReviews[i].id === reviewId) {
      flag3 = "true";
      break;
    }
  }
  if (flag3 != "true") {
    flag1 = "true";
  }

  for (let i = 0; i < retrivedUser.upvotedReviews.length; i++) {
    if (retrivedUser.upvotedReviews[i].id === reviewId) {
      flag2 = "true";
      break;
    }
  }
  if (flag2 != "true") {
    flag4 = "true";
  }


  if (flag3 === "true") {
    throw "already downvoted";
  }


  if (flag1 === "true" && flag2 === "true") {
    const updateInfo1 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $pull: {
          upvotedReviews: {
            id: reviewId
          }
        }
      }
    );
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
    throw 'Removing review id from upvotedReviews failed';

    const updateInfo2 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedReviews: {
            id: reviewId
          }
        }
      }
    );
    if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
    throw 'Adding review id to downvotedReviews failed';

    let votes = retrivedReview.votes;
    const updateInfo3 = await reviewCollection.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $set: {
          votes: votes - 2
        }
      }
    );
    if (!updateInfo3.matchedCount && !updateInfo3.modifiedCount)
    throw 'Updating vote count failed';
  }

  if (flag1 === "true" && flag4 === "true") {
    const updateInfo5 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedReviews: {
            id: reviewId
          }
        }
      }
    );
    if (!updateInfo5.matchedCount && !updateInfo5.modifiedCount)
    throw 'Adding review id to downvotedReviews failed';

    let votes1 = retrivedReview.votes;
    const updateInfo4 = await reviewCollection.updateOne(
      { _id: ObjectId(reviewId) },
      {
        $set: {
          votes: votes1 - 1
        }
      }
    );
    if (!updateInfo4.matchedCount && !updateInfo4.modifiedCount)
    throw 'Updating vote count failed';
  }
  return { msg: "Downvote Successful!" }

}

async function removeUpvote(reviewId, userId){
  const userCollection = await user();
  const reviewCollection = await reviews();
  if (!userId || !reviewId ) {
    throw 'All fields need to have valid values';
  }

  if (typeof (reviewId) != 'string') {
    throw 'Review ID should be a string';
  }
  if (typeof (userId) != 'string') {
    throw 'User ID should be a string';
  }

  if (reviewId.length === 0) {
    throw 'Review ID cannot be a empty string';
  }

  if (userId.length === 0) {
    throw 'User ID cannot be a empty string';
  }

  if (reviewId.trim().length === 0) {
    throw 'Review ID cannot be just empty spaces';
  }

  if (userId.trim().length === 0) {
    throw 'User ID cannot be just empty spaces';
  }
  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw 'Review Id should be valid ObjectId';
  }


  const retrivedReview = await reviewCollection.findOne({ _id: ObjectId(reviewId) });
  if (!retrivedReview){
    throw 'Review not found';
    }
  let flag3= "false";
  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  for (let i = 0; i < retrivedUser.upvotedReviews.length; i++) {
    console.log(retrivedUser.upvotedReviews.length);
    if (retrivedUser.upvotedReviews[i].id === reviewId) {
      flag3 = "true";
      break;
    }
}
if(flag3 ==="false"){
  throw "Upvote authentication failed";
}

if(flag3==="true"){
  const updateInfo1 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    {
      $pull: {
        upvotedReviews: {
          id: reviewId
        }
      }
    }
  );
  if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
  throw 'Removing review id from upvotedReviews failed';
  
  let votes2 = retrivedReview.votes;
  const updateInfo4 = await reviewCollection.updateOne(
    { _id: ObjectId(reviewId) },
    {
      $set: {
        votes: votes2 - 1
      }
    }
  );
  if (!updateInfo4.matchedCount && !updateInfo4.modifiedCount)
  throw 'Removing upvote failed';

}
return { msg: "Remove Upvote Successful!" }
}


async function removeDownvote(reviewId, userId){
  const userCollection = await user();
  const reviewCollection = await reviews();
  if (!userId || !reviewId ) {
    throw 'All fields need to have valid values';
  }

  if (typeof (reviewId) != 'string') {
    throw 'Review ID should be a string';
  }
  if (typeof (userId) != 'string') {
    throw 'User ID should be a string';
  }

  if (reviewId.length === 0) {
    throw 'Review ID cannot be a empty string';
  }

  if (userId.length === 0) {
    throw 'User ID cannot be a empty string';
  }

  if (reviewId.trim().length === 0) {
    throw 'Review ID cannot be just empty spaces';
  }

  if (userId.trim().length === 0) {
    throw 'User ID cannot be just empty spaces';
  }
  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw 'Review Id should be valid ObjectId';
  }


  const retrivedReview = await reviewCollection.findOne({ _id: ObjectId(reviewId) });
  if (!retrivedReview){
    throw 'Review not found';
    }
  let flag3= "false";
  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  for (let i = 0; i < retrivedUser.downvotedReviews.length; i++) {
    console.log(retrivedUser.downvotedReviews.length);
    if (retrivedUser.downvotedReviews[i].id === reviewId) {
      flag3 = "true";
      break;
    }
}
if(flag3 ==="false"){
  throw "Downvote authentication failed";
}

if(flag3==="true"){
  const updateInfo1 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    {
      $pull: {
        downvotedReviews: {
          id: reviewId
        }
      }
    }
  );
  if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
  throw 'Removing review id from upvotedReviews failed';
  
  let votes2 = retrivedReview.votes;
  const updateInfo4 = await reviewCollection.updateOne(
    { _id: ObjectId(reviewId) },
    {
      $set: {
        votes: votes2 + 1
      }
    }
  );
  if (!updateInfo4.matchedCount && !updateInfo4.modifiedCount)
  throw 'Removing Downvote failed';

}
return { msg: "Remove Downvote Successful!" }
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
  removeDownvote
};

