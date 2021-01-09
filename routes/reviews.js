const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const Campground = require('../models/CampModel');
const Review = require('../models/Review');
const {reviewSchema} = require('../schemas/validation');
const { validation2, isLoggedIn, isReviewOwner } = require('../middleware'); 

const reviews = require('../controllers/reviews')
// take reviews info and update it in database
router.post('/campgrounds/:id/reviews', isLoggedIn, validation2, catchAsync(reviews.review));

// delete specific review in both campground and review database
router.delete('/campgrounds/:id/reviews/:reviewID', isReviewOwner, isLoggedIn, catchAsync(reviews.delete));

module.exports = router;