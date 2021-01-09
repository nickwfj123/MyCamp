const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync')
const ExpressError = require('../utility/ExpressError')
const Campground = require('../models/CampModel');
const Review = require('../models/Review');
const {campgroundSchema} = require('../schemas/validation');
const { isLoggedIn, validationEdit, validationNew, isOwner } = require('../middleware');  

const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const campgrounds = require('../controllers/campgrounds');

router.get('/campgrounds', isLoggedIn, catchAsync(campgrounds.list));

router.get('/campgrounds/new', isLoggedIn, campgrounds.newPage);
router.post('/campgrounds', isLoggedIn, upload.array('img'), validationNew, catchAsync(campgrounds.new));


router.get('/campgrounds/:id', catchAsync(campgrounds.show));

router.get('/campgrounds/:id/edit', isOwner, catchAsync(campgrounds.editPage));
router.put('/campgrounds/:id/edit', isOwner, upload.array('img'), validationEdit, catchAsync(campgrounds.edit));

router.delete('/campgrounds/:id', catchAsync(campgrounds.delete));

module.exports = router;