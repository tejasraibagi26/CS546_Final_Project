const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const comments = mongoCollections.comments;
const user = mongoCollections.user;
const { ObjectId } = require('mongodb');
const user1 = require('./user');
const review = require('./reviews');
const bodyParser = require('body-parser');
const errorHandler = require("../Errors/errorHandler");


//---------------------------------------------------------------------------------------------------------

async function addComment(userId, reviewId, commentText) {
  
  /* Error Handling */

  let array = [userId, reviewId, commentText];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  try {
    ObjectId(userId);
  } 
  catch (error) {
    throw 'User Id should be valid ObjectId';
  }
  
  try {
    ObjectId(reviewId);
  } 
  catch (error) {
    throw 'review Id should be valid ObjectId';
  }


  const reviewCollection = await reviews();
  const userCollection = await user();
  const commentCollection = await comments();

  /* Checking if user exists */

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw 'User not found';

  /* Checking if review exists */

  const reviewThatGotPosted = await review.getReviewById(reviewId);
  if (!reviewThatGotPosted) throw 'Review not found';


  /* Defining a new Comment */

  let newComment = {
    reviewerId: userId,
    reviewId: reviewId,
    commentText: commentText,
    votes: 0,

  };

  /* Checking if Comment added successfully */

  const insertInfo = await commentCollection.insertOne(newComment);
  if (insertInfo.insertedCount === 0) throw 'Could not add Comment';

  const newId = insertInfo.insertedId;
  const comment = await this.getCommentById(newId.toString());
  comment._id = comment._id.toString();


  /* Updating the comment in review collection by adding the commentId to the review */

  const addComent = await review.addCommentToReview(reviewId,comment._id);

  /* Updating the commentId in user collection by adding the comment Id to the user */

  const updateInfo1 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    {
      $addToSet: {
        commentId: {
          _id: comment._id
        }
      }
    }
  );
  /* Checking if comment Id is added to the user successfully */

  if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
    throw 'adding comment to user failed';

  return { msg: "Comment Added" };
}

//---------------------------------------------------------------------------------------------------------

async function removeComment(id, userId, reviewId) {
  
  /* Error Handling */

  let array = [id, userId, reviewId];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw 'review Id should be valid ObjectId';
  }

  try {
    ObjectId(id);
  } catch (error) {
    throw 'comment ID Id should be valid ObjectId';
  }
  
  const reviewCollection = await reviews();
  const userCollection = await user();
  const commentCollection = await comments();

  /* Checking if comment exists */

  const commentPosted = await getCommentById(id);
  if (!commentPosted) {
    throw 'comment not found';
  }

  /* Checking if the comment belongs to that particular review or not */

  if (commentPosted.reviewId != reviewId) {
    throw 'comment authentication failed for review';
  }

  /* Checking if the comment belongs to that particular user or not */

  if (commentPosted.reviewerId != userId) {
    throw 'comment authentication failed for user';
  }

  /* Checking if user exists */

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw 'User not found';

  /* Checking if review exists */

  const reviewThatGotPosted = await review.getReviewById(reviewId);
  if (!reviewThatGotPosted) throw 'Review not found';


  let comment = null;
  try {
    comment = await this.getCommentById((id));
  } catch (e) {
    console.log(e);
    return;
  }

  /* Checking if comment deletion was successfull ot not */

  const deletionInfo = await commentCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete comment with id of ${id}`;
  }

  /* Updating the reviews under venue whenever a review is deleted */

  const updateInfo = await review.removeCommentFromReview(reviewId,id);

  /* Updating the commentId under user whenever a comment is deleted */

  const updateInfo1 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    {
      $pull: {
        commentId: {
          _id: id
        }
      }
    }
  );
  if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
    throw 'deleting comment from user failed';

  return { msg: "Comment removed" };
}
//---------------------------------------------------------------------------------------------------------

async function updateCommentText(id, userId, reviewId, commentText) {
  
  /* Error Handling */

  let array = [id, userId, reviewId, commentText];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(reviewId);
  } catch (error) {
    throw 'Venue Id should be valid ObjectId';
  }

  try {
    ObjectId(id);
  } catch (error) {
    throw 'comment ID Id should be valid ObjectId';
  }

  const commentCollection = await comments();

  /* Checking if comment exists */

  const commentPosted = await getCommentById(id);
  if (!commentPosted) {
    throw 'comment not found';
  }

  /* Checking if review belongs to that particular venue */

  if (commentPosted.reviewId != reviewId) {
    throw 'comment authentication failed for review';
  }

  /* Checking if review belongs to that particular user */

  if (commentPosted.reviewerId != userId) {
    throw 'comment authentication failed for user';
  }
  /* Checking if user exists*/

  const userThatPosted = await user1.getUserById(userId);
  if (!userThatPosted) throw 'User not found';

  /* Checking if venue exists*/

  const reviewThatGotPosted = await review.getReviewById(reviewId);
  if (!reviewThatGotPosted) throw 'Review not found';


  const updatedComment = {
    commentText: commentText,
  };

  /* Updating the review text */

  const updatedInfo = await commentCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedComment }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw 'could not update comment text successfully';
  }
  const comment = await this.getCommentById(id);
  return { msg: "Updated Comment text successfully" };
}

//---------------------------------------------------------------------------------------------------------

async function getCommentById(id) {

  /* Error Handling */

  let array1 = [id];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(id);
  } catch (error) {
    throw 'comment id should be valid ObjectId';
  }

  /* Retriving the comment by its Id */

  const commentCollection = await comments();
  const comment = await commentCollection.findOne({ _id: ObjectId(id) });

  if (!comment) throw 'Comment not found';
  return comment;
}
//---------------------------------------------------------------------------------------------------------

async function getAllComments() {

  /* Error Handling */

  if (Object.keys(arguments).length !== 0) {
    throw "No arguments allowed";
  }

  /* Getting all reviews from the collection */

  const commentCollection = await comments();
  return await commentCollection.find({}).toArray();
}

//---------------------------------------------------------------------------------------------------------

async function upVote(commentId, userId) {
  
  /* Error Handling */

  let array1 = [commentId, userId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(commentId);
  } catch (error) {
    throw 'comment Id should be valid ObjectId';
  }
  
  const userCollection = await user();
  const commentCollection = await comments();

  /* Retriving and Checking if review exists */

  const retrivedComment = await commentCollection.findOne({ _id: ObjectId(commentId) });
  if (!retrivedComment) {
    throw 'Comment not found';
  }

  /* Checking if user  exists */

  let flag1, flag2, flag3, flag4;
  const retrivedUser1 = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!retrivedUser1) throw 'User not found';

  /* Creating a dummy review in upvotedReviews in user which is not tied upto any user or venue or and its ID set to 0 for initial iteration */

  if (retrivedUser1.upvotedComments.length === 0 && retrivedUser1.downvotedComments.length ===0) {
    const updateInfo10 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedComments: {
            id: "0"
          }
        }
      }
    );
    if (!updateInfo10.matchedCount && !updateInfo10.modifiedCount)
      throw 'updating dummy _id value for upvoted comment failed';

    /* Creating a dummy comment in downvotedReviews in user which is not tied upto any user or review or and its ID set to 0 for initial iteration */

    const updateInfo9 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedComments: {
            id: "0"
          }
        }
      }
    );
    if (!updateInfo9.matchedCount && !updateInfo9.modifiedCount)
      throw 'updating dummy _id value for downvoted comments failed';
  }

  /* Retriving and checking if the user exists  */

  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!retrivedUser) {
    throw 'User  not found';
  }

  /* checking if the user already upvoted that particular comment  */

  for (let i = 0; i < retrivedUser.upvotedComments.length; i++) {

    if (retrivedUser.upvotedComments[i].id === commentId) {
      flag3 = true;
      break;
    }
  }
  if (flag3 != true) {
    flag1 = true;
  }

  /* checking if the user already Downvoted that particular comment  */

  for (let i = 0; i < retrivedUser.downvotedComments.length; i++) {
    if (retrivedUser.downvotedComments[i].id === commentId) {
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
          downvotedComments: {

            id: commentId
          }
        }
      }
    );
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
      throw 'removing comment id from downvotedComments failed';

    const updateInfo2 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedComments: {

            id: commentId
          }
        }
      }
    );

    if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
      throw 'removing comment id from upvotedComments failed';


    /* Updating overall vote count */

    let votes3 = retrivedComment.votes;
    const updateInfo3 = await commentCollection.updateOne(
      { _id: ObjectId(commentId) },
      {
        $set: {
          votes: votes3 + 2
        }
      }
    );
    if (!updateInfo3.matchedCount && !updateInfo3.modifiedCount)
      throw 'Updating vote count failed';
  }

  /* If user never downvoted or upvoted that comment and now choose to upvote then upvote is being enforced */

  if (flag1 === true && flag4 === true) {
    const updateInfo5 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedComments: {

            id: commentId
          }
        }
      }
    );

    if (!updateInfo5.matchedCount && !updateInfo5.modifiedCount)
      throw 'Adding comment id to upvotedComments failed';

    /* Updating the overall vote count */

    let votes2 = retrivedComment.votes;
    const updateInfo4 = await commentCollection.updateOne(
      { _id: ObjectId(commentId) },
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

async function downVote(commentId, userId) {
  
  /* Error Handling */
  let array1 = [commentId, userId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(commentId);
  } catch (error) {
    throw 'comment Id should be valid ObjectId';
  }

  const userCollection = await user();
  const commentCollection = await comments();

  /* Checking if review exists */

  const retrivedComment = await commentCollection.findOne({ _id: ObjectId(commentId) });
  if (!retrivedComment) {
    throw 'Comment not found';
  }
  let flag1, flag2, flag3, flag4;

  /*Checking if user exists*/

  const retrivedUser1 = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!retrivedUser1) throw 'User not found';

  /* Creating a dummy review in upvotedReviews in user which is not tied upto any user or venue or and its ID set to 0 for initial iteration */

  if (retrivedUser1.upvotedComments.length === 0 && retrivedUser1.downvotedComments.length === 0) {
    const updateInfo9 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          upvotedComments: {
            id: "0"
          }
        }
      }
    );

    /* Creating a dummy review in downvotedReviews in user which is not tied upto any user or venue or and its ID set to 0 for initial iteration */

    if (!updateInfo9.matchedCount && !updateInfo9.modifiedCount)
      throw 'updating dummy _id value for upvoted Comments failed';
    const updateInfo10 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedComments: {
            id: "0"
          }
        }
      }
    );
    if (!updateInfo10.matchedCount && !updateInfo10.modifiedCount)
      throw 'updating dummy _id value for downvoted Comments failed';
  }

  /* checking if the user already downvoted that particular review  */

  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  for (let i = 0; i < retrivedUser.downvotedComments.length; i++) {
    if (retrivedUser.downvotedComments[i].id === commentId) {
      flag3 = true;
      break;
    }
  }
  if (flag3 != true) {
    flag1 = true;
  }
  /* checking if the user already upvoted that particular review  */

  for (let i = 0; i < retrivedUser.upvotedComments.length; i++) {
    if (retrivedUser.upvotedComments[i].id === commentId) {
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
          upvotedComments: {
            id: commentId
          }
        }
      }
    );
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
      throw 'Removing coment id from upvotedComments failed';

    const updateInfo2 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedComments: {
            id: commentId
          }
        }
      }
    );
    if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount)
      throw 'Adding comment id to downvotedComments failed';

    let votes = retrivedComment.votes;
    const updateInfo3 = await commentCollection.updateOne(
      { _id: ObjectId(commentId) },
      {
        $set: {
          votes: votes - 2
        }
      }
    );
    if (!updateInfo3.matchedCount && !updateInfo3.modifiedCount)
      throw 'Updating vote count failed';
  }

  /* If user never downvoted or upvoted that review and now choose to downvote then downvote is being enforced */

  if (flag1 === true && flag4 === true) {
    const updateInfo5 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          downvotedComments: {
            id: commentId
          }
        }
      }
    );
    if (!updateInfo5.matchedCount && !updateInfo5.modifiedCount)
      throw 'Adding comment id to downvotedComments failed';

    /* Updating overall vote count */

    let votes1 = retrivedComment.votes;
    const updateInfo4 = await commentCollection.updateOne(
      { _id: ObjectId(commentId) },
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

async function removeUpvote(commentId, userId) {
  
  /* Error Handling */

  let array1 = [commentId, userId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(commentId);
  } catch (error) {
    throw 'comment Id should be valid ObjectId';
  }
  
  const userCollection = await user();
  const commentCollection = await comments();


    /* Checking if review exists */

  const retrivedComment = await commentCollection.findOne({ _id: ObjectId(commentId) });
  if (!retrivedComment) {
    throw 'Comment not found';
  }

  /* Checking if user ever upvoted the review in the first place  */

  let flag3 = "false";
  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  for (let i = 0; i < retrivedUser.upvotedComments.length; i++) {

    if (retrivedUser.upvotedComments[i].id === commentId) {
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
          upvotedComments: {
            id: commentId
          }
        }
      }
    );
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
      throw 'Removing comment id from upvotedComments failed';

    /* Overall vote count is being updated */

    let votes2 = retrivedComment.votes;
    const updateInfo4 = await commentCollection.updateOne(
      { _id: ObjectId(commentId) },
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

async function removeDownvote(commentId, userId) {
  
  /* Error Handling */

  let array1 = [commentId, userId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(userId);
  } catch (error) {
    throw 'User Id should be valid ObjectId';
  }

  try {
    ObjectId(commentId);
  } catch (error) {
    throw 'comment Id should be valid ObjectId';
  }
  
  const userCollection = await user();
  const commentCollection = await comments();

  /* Checking if review exists */

  const retrivedComment = await commentCollection.findOne({ _id: ObjectId(commentId) });
  if (!retrivedComment) {
    throw 'Comment not found';
  }

  /* Checking if user ever downvoted the review in the first place  */

  let flag3 = false;
  const retrivedUser = await userCollection.findOne({ _id: ObjectId(userId) });
  for (let i = 0; i < retrivedUser.downvotedComments.length; i++) {

    if (retrivedUser.downvotedComments[i].id === commentId) {
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
          downvotedComments: {
            id: commentId
          }
        }
      }
    );
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount)
      throw 'Removing comment id from downvotedComments failed';

    /* Overall vote count is being updated */

    let votes2 = retrivedComment.votes;
    const updateInfo4 = await commentCollection.updateOne(
      { _id: ObjectId(commentId) },
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

async function mostUpvoted(reviewId) {
  let array1 = [reviewId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(reviewId);
  } catch (error) {
    throw 'review ID should be valid ObjectId';
  }

  const commentCollection = await comments();
  const content = await review.getReviewById(reviewId)
  if (content.comments.length === 0) {
    throw "No comments to filter out";
  }
  let venueComments = [];
  const sort = { votes: -1 }
  let newArray = await commentCollection.find().sort(sort).toArray();
  for (let key of newArray) {
    if (key.reviewId === reviewId) {
      venueComments.push(key);
    }
  }
  return venueComments;
}

//---------------------------------------------------------------------------------------------------------


async function mostDownvoted(reviewId) {
  let array1 = [reviewId];

  errorHandler.checkIfElementsExists(array1);
  errorHandler.checkIfElementsAreStrings(array1);
  errorHandler.checkIfElementNotEmptyString(array1);
  try {
    ObjectId(reviewId);
  } catch (error) {
    throw 'review ID should be valid ObjectId';
  }

  const commentCollection = await comments();
  const content = await review.getReviewById(reviewId)
  if (content.comments.length === 0) {
    throw "No comments to filter out";
  }
  let venueComments = [];
  const sort = { votes: 1 }
  let newArray = await commentCollection.find().sort(sort).toArray();
  for (let key of newArray) {
    if (key.reviewId === reviewId) {
      venueComments.push(key);
    }
  }
  return venueComments;
}


module.exports = {
  addComment,
  removeComment,
  updateCommentText,
  getAllComments,
  getCommentById,
  upVote,
  downVote,
  removeUpvote,
  removeDownvote,
  mostUpvoted,
  mostDownvoted
};
