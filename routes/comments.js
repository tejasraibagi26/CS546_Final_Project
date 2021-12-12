const express = require('express');
const router = express.Router();
const data = require('../data');
const resData = data.comments;
const userData = data.user;
const revData = data.reviews;
const { ObjectId } = require('mongodb');
const errorHandler = require("../Errors/errorHandler");
const { venue } = require('../config/mongoCollections');
const xss = require("xss");

//---------------------------------------------------------------------------------------------------------

router.get('/:id', async (req, res) => {

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
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        let rest = await resData.getCommentById(id);
        res.status(200).json(rest);
    } catch (e) {
        res.status(404).json({ error: 'Comment not found' });
    }
});

//---------------------------------------------------------------------------------------------------------

router.get('/', async (req, res) => {
    try {
        let resList = await resData.getAllComments();
        res.status(200).json(resList);
    } catch (e) {
        res.status(500).json({ error: e });   
    }
});

//---------------------------------------------------------------------------------------------------------

router.post('/text/:id/:userId/:reviewId/:venueId', async (req, res) => {

   

    const id = req.params.id;
    const  venueId = req.params.venueId;
    const userId = req.params.userId;
    const reviewId = req.params.reviewId;
    const commentText = xss(req.body.commentText);

    let array = [id, userId, reviewId,venueId];
    let inputString = [id, userId, reviewId,venueId, commentText];
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
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(venueId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(reviewId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        await resData.getCommentById(id);
    } catch (e) {
        res.status(404).json({ error: 'Comment not found' });
        return;
    }
    try {
        await userData.getUserById(userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        await revData.getReviewById(reviewId);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
  
    try {
        const updatedReview = await resData.updateCommentText(id, userId, reviewId,venueId, commentText);


        const venueReviews = await resData.getAllCommentsByReviewId(reviewId,venueId);
        //console.log(req.session.user.id);
        for(let i=0;i<venueReviews.length;i++){
          venueReviews[i].reviewerId = await userData.getUserById(venueReviews[i].reviewerId);
          venueReviews[i].reviewId = req.session.user.id;
          venueReviews[i].reviewerId = venueReviews[i].reviewerId.firstName.concat(" ",venueReviews[i].reviewerId.lastName);
          venueReviews[i]._id = venueReviews[i]._id.toString();
        }
        let venuedetails =  await revData.getReviewById(reviewId);
        let name = await userData.getUserById(venuedetails.reviewerId);
        let reviewuserName = name.firstName.concat(" ",name.lastName);
        let reviewid = venuedetails._id.toString();

        let getUser = await userData.getUserById(req.session.user.id);
        let allComments = getUser.commentId;

        let AllComments =[];
       //console.log( 'i am here');
        for(i=0;i<allComments.length;i++){
            let temp = await resData.getCommentById(allComments[i]._id);
            if(temp.reviewId === reviewId){
            AllComments.push(temp);
            }
        }
        //console.log('i am after');
        for(let i=0;i<AllComments.length;i++){
            AllComments[i].reviewerId = getUser.firstName.concat(" ",getUser.lastName);
            AllComments[i]._id = AllComments[i]._id.toString();
            AllComments[i].reviewId = req.session.user.id;
            AllComments[i].review = reviewId;
        }
        res.redirect("/comments/reviewcomments/"+reviewId+"/"+venueId)
        } 
            catch (e) {
                res.render("comments/ReviewComment", {
                  title: "Error",
                  error1: e,
                  userId : req.params.userId,
                  reviewId : req.params.reviewId,
              
                });
            }
});

//---------------------------------------------------------------------------------------------------------

router.get('/delete/:id/:userId/:reviewId', async (req, res) => {


    const id = req.params.id;
    const userId = req.params.userId;
    const reviewId = req.params.reviewId;

    let array = [id, userId, reviewId];

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
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(reviewId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        await resData.getCommentById(id);
    } catch (e) {
        res.status(404).json({ error: 'Comment not found' });
        return;
    }
    try {
        await userData.getUserById(userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        await revData.getReviewById(reviewId);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    try {
        await resData.removeComment(id, userId, reviewId);
        res.redirect('back');
    } catch (e) {
        res.status(500).json({ error: e });
    }
});



//---------------------------------------------------------------------------------------------------------





router.get("/addcomment/:userId/:reviewId/:venueId", async (req, res) => {
    res.render("comments/createComment", {
      title: "Add Comment",
      userId : req.params.userId,
      reviewId : req.params.reviewId,
      venueId : req.params.venueId,
  
    });
  });

  router.get("/updatecomment/:id/:userId/:reviewId/:venueId", async (req, res) => {
    let id=req.params.id;
    let venueid=req.params.venueId;
      let text = await resData.getCommentById(id);
      text = text.commentText;
    res.render("comments/update", {
      title: "Add Comment",
      id:req.params.id,
      userId : req.params.userId,
      reviewId : req.params.reviewId,
      text :text,
      venueId :venueid,
  
    });
  });


router.post('/:userId/:reviewId/:venueId', async (req, res) => { 


    const userId = req.params.userId;
    const venueId = req.params.venueId;
    const reviewId = req.params.reviewId;
    const commentText = xss(req.body.commentText);

    let inputString = [userId, reviewId,venueId, commentText];
    let check = [userId, reviewId,venueId, commentText];
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
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(venueId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(reviewId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        await userData.getUserById(userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        await revData.getReviewById(reviewId);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }

    try {
        const postComment = await resData.addComment(userId, reviewId,venueId, commentText);
        res.render("comments/createComment", {
            title: "Success",
            error2: "Commented Successfully",
            userId : req.params.userId,
            reviewId : req.params.reviewId,
            venueId : venueId,
          });
    } 
        catch (e) {
            res.render("comments/createComment", {
              title: "Error",
              error1: e,
              userId : req.params.userId,
              reviewId : req.params.reviewId,
              venueId : venueId,
            });
        }
});


//---------------------------------------------------------------------------------------------------------

router.get('/upvote/:commentId/:userId', async (req, res) => {


    const commentId = req.params.commentId;
    const userId = req.params.userId;


    let array = [userId, commentId];
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
        ObjectId(commentId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }



    try {
        await resData.getCommentById(commentId);
    } catch (e) {
        res.status(404).json({ error: 'Comment not found' });
        return;
    }
    try {
        await userData.getUserById(userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        const updatedComment = await resData.upVote(commentId, userId);
        res.redirect('back');
    } catch (e) {
        res.redirect('/comments/removeup/'+commentId+'/'+userId);
    }
});
//---------------------------------------------------------------------------------------------------------

router.get('/downvote/:commentId/:userId', async (req, res) => {

    const commentId = req.params.commentId;
    const userId = req.params.userId;
    let array = [userId, commentId];
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
        ObjectId(commentId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        await resData.getCommentById(commentId);
    } catch (e) {
        res.status(404).json({ error: 'Comment not found' });
        return;
    }
    try {
        await userData.getUserById(userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        const updatedComment = await resData.downVote(commentId, userId);
        res.redirect('back');
    } catch (e) {
     
        res.redirect('/comments/removedown/'+commentId+'/'+userId);
    }
});
//---------------------------------------------------------------------------------------------------------

router.get('/removeup/:commentId/:userId', async (req, res) => {

    const commentId = req.params.commentId;
    const userId = req.params.userId;

    let array = [userId, commentId];
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
        ObjectId(commentId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        await resData.getCommentById(commentId);
    } catch (e) {
        res.status(404).json({ error: 'Comment not found' });
        return;
    }
    try {
        await userData.getUserById(userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        const updatedComment = await resData.removeUpvote(commentId, userId);
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});
//---------------------------------------------------------------------------------------------------------

router.get('/removedown/:commentId/:userId', async (req, res) => {

    const commentId = req.params.commentId;
    const userId = req.params.userId;
    let array = [userId, commentId];
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
        ObjectId(commentId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        await resData.getCommentById(commentId);
    } catch (e) {
        res.status(404).json({ error: 'Comment not found' });
        return;
    }
    try {
        await userData.getUserById(userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        const updatedComment = await resData.removeDownvote(commentId, userId);
        res.redirect('back');
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});
//---------------------------------------------------------------------------------------------------------

router.get('/mostupvote/:reviewId/:venueId', async (req, res) => {
        const id = req.params.reviewId;
        let reviewId = id;
        let venueId = req.params.venueId;
        let array = [id,venueId];
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
            res.status(400).json({ error: 'ReviewId should be valid object ID' });
            return;
        }
        try {
            ObjectId(venueId);
        } catch (error) {
            res.status(400).json({ error: 'Id should be valid object ID' });
            return;
        }
        try {
            await revData.getReviewById(id);
        } catch (e) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }

        try {
            const getNewest = await resData.mostUpvoted(id,venueId);
            for(let i=0;i<getNewest.length;i++){
              getNewest[i].reviewId = req.session.user.id;
              getNewest[i].reviewerId = await userData.getUserById(getNewest[i].reviewerId);
              getNewest[i].reviewerId = getNewest[i].reviewerId.firstName.concat(" ",getNewest[i].reviewerId.lastName);
              getNewest[i]._id = getNewest[i]._id.toString();
            
            }
            let venueDetails =  await revData.getReviewById(id);
            let name = await userData.getUserById(venueDetails.reviewerId);
            let reviewusername = name.firstName.concat(" ",name.lastName);
            let reviewid = venueDetails._id.toString();

            let getUser = await userData.getUserById(req.session.user.id);
        let allComments = getUser.commentId;

        let AllComments =[];
       //console.log(allComments);
        for(i=0;i<allComments.length;i++){
            let temp = await resData.getCommentById(allComments[i]._id);
            if(temp.reviewId === id){
                AllComments.push(temp);
                }
        }
        //console.log(AllComments);
        for(let i=0;i<AllComments.length;i++){
            AllComments[i].reviewerId = getUser.firstName.concat(" ",getUser.lastName);
            AllComments[i]._id = AllComments[i]._id.toString();
            AllComments[i].reviewId = req.session.user.id;
            AllComments[i].review = reviewId;
            AllComments[i].venueId = venueId;
        }
        
            res.render("comments/filter", {
              title: "Filtered",
              venueReview : getNewest,
              venueDetails : venueDetails,
              reviewusername : reviewusername,
              reviewId : id,
              allComments : AllComments,
              venueId:venueId,
            });
          } catch (e) {
            res.status(500).json({ error: e });
          }
        }),


//---------------------------------------------------------------------------------------------------------

router.get('/mostdownvote/:reviewId/:venueId', async (req, res) => {
    const id = req.params.reviewId;
    const reviewId = id;
    let venueId = req.params.venueId;
    let array = [id,venueId];
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
        res.status(400).json({ error: 'ReviewId should be valid object ID' });
        return;
    }
    try {
        ObjectId(venueId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        await revData.getReviewById(id);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }

    try {
        const getNewest = await resData.mostDownvoted(id,venueId);
        for(let i=0;i<getNewest.length;i++){
          getNewest[i].reviewId = req.session.user.id;
          getNewest[i].reviewerId = await userData.getUserById(getNewest[i].reviewerId);
          getNewest[i].reviewerId = getNewest[i].reviewerId.firstName.concat(" ",getNewest[i].reviewerId.lastName);
          getNewest[i]._id = getNewest[i]._id.toString();
        
        }
        let venueDetails =  await revData.getReviewById(id);
        let name = await userData.getUserById(venueDetails.reviewerId);
        let reviewusername = name.firstName.concat(" ",name.lastName);
        let reviewid = venueDetails._id.toString();

        let getUser = await userData.getUserById(req.session.user.id);
        let allComments = getUser.commentId;

        let AllComments =[];
       //console.log(allComments);
        for(i=0;i<allComments.length;i++){
            let temp = await resData.getCommentById(allComments[i]._id);
            if(temp.reviewId === reviewId){
                AllComments.push(temp);
                }
        }
         //console.log(AllComments);
         for(let i=0;i<AllComments.length;i++){
            AllComments[i].reviewerId = getUser.firstName.concat(" ",getUser.lastName);
            AllComments[i]._id = AllComments[i]._id.toString();
            AllComments[i].reviewId = req.session.user.id;
            AllComments[i].review = reviewId;
            AllComments[i].venueId = venueId;
        }
        


        res.render("comments/filter", {
          title: "Filtered",
          venueReview : getNewest,
          venueDetails : venueDetails,
          reviewusername : reviewusername,
          reviewId : id,
          allComments : AllComments,
          venueId: venueId,
        });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }),



router.get("/reviewcomments/:reviewId/:venueId", async (req, res) => {
       let reviewId = req.params.reviewId;
       let venueId = req.params.venueId;
        //let array = [id, userId, venueId];
        let inputString = [reviewId,venueId];
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
          ObjectId(reviewId);
        } catch (error) {
          res.status(400).json({ error: "Id should be valid object ID" });
          return;
        }
        try {
            ObjectId(venueId);
        } catch (error) {
            res.status(400).json({ error: 'Id should be valid object ID' });
            return;
        }
        try {
          await revData.getReviewById(reviewId);
        } catch (e) {
          res.status(404).json({ error: "Review not found" });
          return;
        }
       try{
        const venueReviews = await resData.getAllCommentsByReviewId(reviewId,venueId);
        //console.log(req.session.user.id);
        for(let i=0;i<venueReviews.length;i++){
          venueReviews[i].reviewerId = await userData.getUserById(venueReviews[i].reviewerId);
          venueReviews[i].reviewId = req.session.user.id;
          venueReviews[i].reviewerId = venueReviews[i].reviewerId.firstName.concat(" ",venueReviews[i].reviewerId.lastName);
          venueReviews[i]._id = venueReviews[i]._id.toString();
        }
        let venuedetails =  await revData.getReviewById(reviewId);
        let name = await userData.getUserById(venuedetails.reviewerId);
        let reviewuserName = name.firstName.concat(" ",name.lastName);
        let reviewid = venuedetails._id.toString();

        let getUser = await userData.getUserById(req.session.user.id);
        let allComments = getUser.commentId;


        let AllComments =[];
       //console.log(allComments);
        for(i=0;i<allComments.length;i++){
            let temp = await resData.getCommentById(allComments[i]._id);
            if(temp.reviewId === reviewId){
            AllComments.push(temp);
            }
        }
        //console.log(AllComments);
        for(let i=0;i<AllComments.length;i++){
            AllComments[i].reviewerId = getUser.firstName.concat(" ",getUser.lastName);
            AllComments[i]._id = AllComments[i]._id.toString();
            AllComments[i].reviewId = req.session.user.id;
            AllComments[i].review = reviewId;
            AllComments[i].venueId = venueId;
        }
        

  res.render("comments/ReviewComment", {
    title: "All Comments",
    venueReview : venueReviews,
    reviewId : reviewid,
    venueDetails : venuedetails,
    reviewusername : reviewuserName,
    allComments : AllComments,
    venueId : venueId,
 

  })
} catch(e){
    res.render("comments/ReviewComment", {
        title: "All Comments",
        error:e,
        venueId : venueId,
    })
}

});

         

  router.get("/newest/:reviewId/:venueId", async (req, res) => {
  
    const id = req.params.reviewId;
    const reviewId = id;
    const venueId = req.params.venueId;
    let array = [id,venueId];
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
      res.status(400).json({ error: "reviewId should be valid object ID" });
      return;
    }
    try {
        ObjectId(venueId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
      await revData.getReviewById(id);
    } catch (e) {
      res.status(404).json({ error: "review not found" });
      return;
    }
  
    try {
      const getNewest = await resData.sortNewest(id, venueId);
      for(let i=0;i<getNewest.length;i++){
        getNewest[i].reviewId = req.session.user.id;
        getNewest[i].reviewerId = await userData.getUserById(getNewest[i].reviewerId);
        getNewest[i].reviewerId = getNewest[i].reviewerId.firstName.concat(" ",getNewest[i].reviewerId.lastName);
        getNewest[i]._id = getNewest[i]._id.toString();
      
      }
      let venueDetails =  await revData.getReviewById(id);
      let name = await userData.getUserById(venueDetails.reviewerId);
      let reviewusername = name.firstName.concat(" ",name.lastName);
      let reviewid = venueDetails._id.toString();



      let getUser = await userData.getUserById(req.session.user.id);
        let allComments = getUser.commentId;

        let AllComments =[];
       //console.log(allComments);
        for(i=0;i<allComments.length;i++){
            let temp = await resData.getCommentById(allComments[i]._id);
            if(temp.reviewId === reviewId){
            AllComments.push(temp);
            }
        }
          //console.log(AllComments);
          for(let i=0;i<AllComments.length;i++){
            AllComments[i].reviewerId = getUser.firstName.concat(" ",getUser.lastName);
            AllComments[i]._id = AllComments[i]._id.toString();
            AllComments[i].reviewId = req.session.user.id;
            AllComments[i].review = reviewId;
            AllComments[i].venueId = venueId;
        }
        

      res.render("comments/filter", {
        title: "Filtered",
        venueReview : getNewest,
        venueDetails : venueDetails,
        reviewusername : reviewusername,
        reviewId : reviewid,
        allComments : AllComments,
        venueId: venueId
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }),

  router.get("/oldest/:reviewId/:venueId", async (req, res) => {
   
    const id = req.params.reviewId;
    const reviewId = id;
    const venueId = req.params.venueId;
    let array = [id,venueId];
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
      res.status(400).json({ error: "reviewId should be valid object ID" });
      return;
    }
    try {
        ObjectId(venueId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
      await revData.getReviewById(id);
    } catch (e) {
      res.status(404).json({ error: "review not found" });
      return;
    }
  
    try {
      const getNewest = await resData.sortOldest(id, venueId);
      for(let i=0;i<getNewest.length;i++){
        getNewest[i].reviewId = req.session.user.id;
        getNewest[i].reviewerId = await userData.getUserById(getNewest[i].reviewerId);
        getNewest[i].reviewerId = getNewest[i].reviewerId.firstName.concat(" ",getNewest[i].reviewerId.lastName);
        getNewest[i]._id = getNewest[i]._id.toString();
      
      }
      let venuedetails =  await revData.getReviewById(id);
      let name = await userData.getUserById(venuedetails.reviewerId);
      let reviewuserName = name.firstName.concat(" ",name.lastName);
      let reviewid = venuedetails._id.toString();


      let getUser = await userData.getUserById(req.session.user.id);
        let allComments = getUser.commentId;

        let AllComments =[];
       //console.log(allComments);
        for(i=0;i<allComments.length;i++){
            let temp = await resData.getCommentById(allComments[i]._id);
            if(temp.reviewId === reviewId){
                AllComments.push(temp);
                }
        }
          //console.log(AllComments);
          for(let i=0;i<AllComments.length;i++){
            AllComments[i].reviewerId = getUser.firstName.concat(" ",getUser.lastName);
            AllComments[i]._id = AllComments[i]._id.toString();
            AllComments[i].reviewId = req.session.user.id;
            AllComments[i].review = reviewId;
            AllComments[i].venueId = venueId;
        }
        

      res.render("comments/filter", {
        title: "Filtered",
        venueReview : getNewest,
        venueDetails : venuedetails,
        reviewusername : reviewuserName,
        reviewId : reviewid,
        allComments : AllComments,
        venueId : venueId,
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }),


//---------------------------------------------------------------------------------------------------------
module.exports = router;
