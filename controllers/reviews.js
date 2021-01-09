const Campground = require('../models/CampModel');
const Review = require('../models/Review');

module.exports.review = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    review.owner = req.user._id;
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review!');
    res.redirect(`/campgrounds/${id}`)
}

module.exports.delete = async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID)
    req.flash('success', 'Successfully deleted!');
    res.redirect(`/campgrounds/${id}`)
}