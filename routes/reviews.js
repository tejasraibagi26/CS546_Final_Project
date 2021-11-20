const express = require('express');
const router = express.Router();
const data = require('../data');
const resData = data.reviews;
const userData = data.user;
const venueData = data.venues;
const { ObjectId } = require('mongodb');

//---------------------------------------------------------------------------------------------------------
router.get('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply an Review ID' });
        return;
    }
    if (typeof (req.params.id) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.id.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.id.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
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
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply an Review ID' });
        return;
    }
    if (!req.params.userId) {
        res.status(400).json({ error: 'You must Supply an User ID' });
        return;
    }
    if (!req.params.venueId) {
        res.status(400).json({ error: 'You must Supply an Venue ID' });
        return;
    }


    if (typeof (req.params.id) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.id.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.id.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }

    if (typeof (req.params.userId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.userId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.userId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }
    if (typeof (req.params.venueId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.venueId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.venueId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }
    if (!resInfo.reviewText) {
        res.status(400).json({ error: 'You must Supply Review text' });
        return;
    }
    if (typeof (resInfo.reviewText) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (resInfo.reviewText.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (resInfo.reviewText.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
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
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply an Review ID' });
        return;
    }
    if (!req.params.userId) {
        res.status(400).json({ error: 'You must Supply an User ID' });
        return;
    }
    if (!req.params.venueId) {
        res.status(400).json({ error: 'You must Supply an Venue ID' });
        return;
    }

    if (typeof (req.params.id) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.id.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.id.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }

    if (typeof (req.params.userId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.userId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.userId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }
    if (typeof (req.params.venueId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.venueId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.venueId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }
    if (!resInfo.rating) {
        res.status(400).json({ error: 'You must Supply Rating' });
        return;
    }
    if (typeof (resInfo.rating) != 'number') {
        res.status(400).json({ error: 'Input should be a number' });
        return;
    }
    if (resInfo.rating < 0 || resInfo.rating > 5) {
        res.status(400).json({ error: 'rating value should be in between 0 to 5' });
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
        const updatedReview = await resData.updateReviewRating(req.params.id, req.params.userId, req.params.venueId, resInfo.rating);
        res.status(200).json(updatedReview);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
});

//---------------------------------------------------------------------------------------------------------
router.delete('/:id/:userId/:venueId', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply an Review ID' });
        return;
    }
    if (!req.params.userId) {
        res.status(400).json({ error: 'You must Supply an User ID' });
        return;
    }
    if (!req.params.venueId) {
        res.status(400).json({ error: 'You must Supply an Venue ID' });
        return;
    }



    if (typeof (req.params.id) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.id.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.id.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }

    if (typeof (req.params.userId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.userId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.userId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }
    if (typeof (req.params.venueId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.venueId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.venueId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
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
    if (!req.params.userId) {
        res.status(400).json({ error: 'You must Supply an User ID' });
        return;
    }
    if (!req.params.venueId) {
        res.status(400).json({ error: 'You must Supply an Venue ID' });
        return;
    }
    if (typeof (req.params.userId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.userId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.userId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }
    if (typeof (req.params.venueId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.venueId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.venueId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }
    if (!resInfo.reviewText) {
        res.status(400).json({ error: 'You must Supply Review text' });
        return;
    }
    if (typeof (resInfo.reviewText) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (resInfo.reviewText.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (resInfo.reviewText.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }
    if (!resInfo.rating) {
        res.status(400).json({ error: 'You must Supply Rating' });
        return;
    }
    if (typeof (resInfo.rating) != 'number') {
        res.status(400).json({ error: 'Input should be a number' });
        return;
    }
    if (resInfo.rating < 0 || resInfo.rating > 5) {
        res.status(400).json({ error: 'rating value should be in between 0 to 5' });
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

     if (!req.params.reviewId) {
        res.status(400).json({ error: 'You must Supply an Review ID' });
        return;
    }
    if (!req.params.userId) {
        res.status(400).json({ error: 'You must Supply an User ID' });
        return;
    }
    
    if (typeof (req.params.reviewId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.reviewId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.reviewId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }

    if (typeof (req.params.userId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.userId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.userId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
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

    if (!req.params.reviewId) {
        res.status(400).json({ error: 'You must Supply an Review ID' });
        return;
    }
    if (!req.params.userId) {
        res.status(400).json({ error: 'You must Supply an User ID' });
        return;
    }
    
    if (typeof (req.params.reviewId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.reviewId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.reviewId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }

    if (typeof (req.params.userId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.userId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.userId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
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
    if (!req.params.reviewId) {
        res.status(400).json({ error: 'You must Supply an Review ID' });
        return;
    }
    if (!req.params.userId) {
        res.status(400).json({ error: 'You must Supply an User ID' });
        return;
    }
    
    if (typeof (req.params.reviewId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.reviewId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.reviewId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }

    if (typeof (req.params.userId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.userId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.userId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
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
    if (!req.params.reviewId) {
        res.status(400).json({ error: 'You must Supply an Review ID' });
        return;
    }
    if (!req.params.userId) {
        res.status(400).json({ error: 'You must Supply an User ID' });
        return;
    }
    
    if (typeof (req.params.reviewId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.reviewId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.reviewId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
        return;
    }

    if (typeof (req.params.userId) != 'string') {
        res.status(400).json({ error: 'Input should be a string' });
        return;
    }
    if (req.params.userId.length === 0) {
        res.status(400).json({ error: 'Input cannot be empty' });
        return;
    }
    if (req.params.userId.trim().length === 0) {
        res.status(400).json({ error: 'Input cannot be just empty spaces' });
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
