const express = require('express');
const router = express.Router();
const data = require('../data');
const resData = data.reviews;
const userData = data.user;
const venueData = data.venues;
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
        ObjectId(req.params.id);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        let rest = await resData.getReviewById(req.params.id);
        res.status(200).json(rest);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
    }
});

//---------------------------------------------------------------------------------------------------------

router.get('/', async (req, res) => {
    try {
        let resList = await resData.getAllReviews();
        res.status(200).json(resList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

//---------------------------------------------------------------------------------------------------------
router.put('/text/:id/:userId/:venueId', async (req, res) => {
    let resInfo = req.body;


    const id = req.params.id;
    const userId = req.params.userId;
    const venueId = req.params.venueId;
    const reviewText = resInfo.reviewText;

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
        ObjectId(req.params.id);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.venueId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        await resData.getReviewById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    try {
        await userData.getUserById(req.params.userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        await venueData.getVenueById(req.params.venueId);
    } catch (e) {
        res.status(404).json({ error: 'Venue not found' });
        return;
    }
    try {
        const updatedReview = await resData.updateReviewText(req.params.id, req.params.userId, req.params.venueId, resInfo.reviewText);
        res.status(200).json(updatedReview);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

//---------------------------------------------------------------------------------------------------------

router.put('/rating/:id/:userId/:venueId', async (req, res) => {
    let resInfo = req.body;

    const id = req.params.id;
    const userId = req.params.userId;
    const venueId = req.params.venueId;
    const rating = resInfo.rating;

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
        ObjectId(req.params.id);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.venueId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        errorHandler.checkIfValidRating(rating);
    } catch (error) {
        res.status(400).json({ err: error });
        return;
    }

    try {
        await resData.getReviewById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    try {
        await userData.getUserById(req.params.userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        await venueData.getVenueById(req.params.venueId);
    } catch (e) {
        res.status(404).json({ error: 'Venue not found' });
        return;
    }
    try {
        const updatedReview = await resData.updateReviewRating(req.params.id, req.params.userId, req.params.venueId, resInfo.rating);
        res.status(200).json(updatedReview);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});

//---------------------------------------------------------------------------------------------------------
router.delete('/:id/:userId/:venueId', async (req, res) => {


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
        ObjectId(req.params.id);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.venueId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        await resData.getReviewById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    try {
        await userData.getUserById(req.params.userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        await venueData.getVenueById(req.params.venueId);
    } catch (e) {
        res.status(404).json({ error: 'Venue not found' });
        return;
    }
    try {
        await resData.removeReview(req.params.id, req.params.userId, req.params.venueId);
        res.sendStatus(200);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});



//---------------------------------------------------------------------------------------------------------
router.post('/:userId/:venueId', async (req, res) => {
    let resInfo = req.body;

    const userId = req.params.userId;
    const venueId = req.params.venueId;
    const reviewText = resInfo.reviewText;
    const rating = resInfo.rating;

    let array = [userId, venueId];
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
        ObjectId(req.params.userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.venueId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        errorHandler.checkIfValidRating(rating);
    } catch (error) {
        res.status(400).json({ err: error });
        return;
    }
    try {
        await userData.getUserById(req.params.userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        await venueData.getVenueById(req.params.venueId);
    } catch (e) {
        res.status(404).json({ error: 'Venue not found' });
        return;
    }

    try {
        const postReview = await resData.addReview(req.params.userId, req.params.venueId, resInfo.reviewText, resInfo.rating);
        res.json(postReview);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});



router.put('/upvote/:reviewId/:userId', async (req, res) => {


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
        ObjectId(req.params.reviewId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }



    try {
        await resData.getReviewById(req.params.reviewId);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    try {
        await userData.getUserById(req.params.userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        const updatedReview = await resData.upVote(req.params.reviewId, req.params.userId);
        res.status(200).json(updatedReview);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});

router.put('/downvote/:reviewId/:userId', async (req, res) => {

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
        ObjectId(req.params.reviewId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        await resData.getReviewById(req.params.reviewId);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    try {
        await userData.getUserById(req.params.userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        const updatedReview = await resData.downVote(req.params.reviewId, req.params.userId);
        res.status(200).json(updatedReview);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});

router.put('/removeup/:reviewId/:userId', async (req, res) => {

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
        ObjectId(req.params.reviewId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        await resData.getReviewById(req.params.reviewId);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    try {
        await userData.getUserById(req.params.userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        const updatedReview = await resData.removeUpvote(req.params.reviewId, req.params.userId);
        res.status(200).json(updatedReview);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});
router.put('/removedown/:reviewId/:userId', async (req, res) => {

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
        ObjectId(req.params.reviewId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }
    try {
        ObjectId(req.params.userId);
    } catch (error) {
        res.status(400).json({ error: 'Id should be valid object ID' });
        return;
    }

    try {
        await resData.getReviewById(req.params.reviewId);
    } catch (e) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    try {
        await userData.getUserById(req.params.userId);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    try {
        const updatedReview = await resData.removeDownvote(req.params.reviewId, req.params.userId);
        res.status(200).json(updatedReview);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});

module.exports = router;
