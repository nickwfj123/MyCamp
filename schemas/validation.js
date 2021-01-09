const joi = require('joi')

module.exports.campgroundSchema = joi.object({
    title: joi.string().required(),
    location: joi.string().required(),
    price: joi.number().min(0).required(),
    // img: joi.string().required(),
    description: joi.string().required(),
    deleteImg: joi.array()
})

module.exports.reviewSchema = joi.object({
    rating: joi.number().required().min(0).max(5),
    body: joi.string().required()
})
