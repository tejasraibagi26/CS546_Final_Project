const express = require('express');
const router = express.Router();
const data = require('../data');
const resData = data.comments;
const userData = data.user;
const revData = data.reviews;
const { ObjectId } = require('mongodb');
const errorHandler = require("../Errors/errorHandler");

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

router.put('/text/:id/:userId/:reviewId', async (req, res) => {



    const id = req.params.id;
    const userId = req.params.userId;
    const reviewId = req.params.reviewId;
    const commentText = req.body.commentText;

    let array = [id, userId, reviewId];
    let inputString = [id, userId, reviewId, commentText];
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
        await resData.getReviewById(id);
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
        await revData.getVenueById(reviewId);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    try {
        const updatedReview = await resData.updateCommentText(id, userId, reviewId, commentText);
        res.status(200).json(updatedReview);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

//---------------------------------------------------------------------------------------------------------

router.delete('/:id/:userId/:reviewId', async (req, res) => {


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
        res.sendStatus(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});



//---------------------------------------------------------------------------------------------------------

router.post('/:userId/:reviewId', async (req, res) => { 


    const userId = req.params.userId;
    const reviewId = req.params.reviewId;
    const commentText = req.body.commentText;

    let inputString = [userId, reviewId, commentText];
    let check = [userId, reviewId, commentText];
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
        const postComment = await resData.addComment(userId, reviewId, commentText);
        res.json(postComment);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


//---------------------------------------------------------------------------------------------------------

router.put('/upvote/:commentId/:userId', async (req, res) => {


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
        res.status(200).json(updatedComment);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});
//---------------------------------------------------------------------------------------------------------

router.put('/downvote/:commentId/:userId', async (req, res) => {

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
        res.status(200).json(updatedComment);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});
//---------------------------------------------------------------------------------------------------------

router.put('/removeup/:commentId/:userId', async (req, res) => {

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
        res.status(200).json(updatedComment);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});
//---------------------------------------------------------------------------------------------------------

router.put('/removedown/:commentId/:userId', async (req, res) => {

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
        res.status(200).json(updatedComment);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});
//---------------------------------------------------------------------------------------------------------

router.get('/mostupvote/:reviewId', async (req, res) => {
        const id = req.params.reviewId;
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
            res.status(400).json({ error: 'ReviewId should be valid object ID' });
            return;
        }

        try {
            await revData.getReviewById(id);
        } catch (e) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }

        try {
            const mostUpvoted = await resData.mostUpvoted(id);
            res.status(200).json(mostUpvoted);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: e });
        }

}),


//---------------------------------------------------------------------------------------------------------

router.get('/mostdownvote/:reviewId', async (req, res) => {
        const id = req.params.reviewId;
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
            res.status(400).json({ error: 'reviewId should be valid object ID' });
            return;
        }

        try {
            await revData.getReviewById(id);
        } catch (e) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }

        try {
            const mostDownvoted = await resData.mostDownvoted(id);
            res.status(200).json(mostDownvoted);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: e });
        }

}),

//---------------------------------------------------------------------------------------------------------
module.exports = router;
