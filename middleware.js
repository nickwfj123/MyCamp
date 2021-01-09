const Campground = require('./models/CampModel');
const Review = require('./models/Review');
const {campgroundSchema, reviewSchema} = require('./schemas/validation');
const ExpressError = require('./utility/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}

// validation for campground
module.exports.validationEdit = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    const { id } = req.params;
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        // throw new ExpressError(msg, 400)
        req.flash('error', msg);
        return res.redirect(`/campgrounds/${id}/edit`)
    }
    next()
}

module.exports.validationNew = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        // throw new ExpressError(msg, 400)
        req.flash('error', msg);
        return res.redirect(`/campgrounds/new`)
    }
    next()
}


// validation for review
module.exports.validation2 = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // console.log(campground.owner._id)
    // console.log(req.user._id)
    if (!campground.owner._id.equals(req.user._id)) {
        req.flash('error', "You don't have Permission.");
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.owner._id.equals(req.user._id)) {
        req.flash('error', "You don't have Permission.");
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}
