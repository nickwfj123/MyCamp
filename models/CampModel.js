const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./Review')

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_100,h_100');
})

const opts = {toJSON: {virtuals: true} };
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    img: [ImageSchema],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]    
}, opts)

campgroundSchema.virtual('properties.popUpText').get(function(){
return `<h6><a href="/campgrounds/${this._id}">${this.title}</a></6>`
})


campgroundSchema.post('findOneAndDelete', async (data) => {
    if (data) {
        await Review.deleteMany({ _id: { $in: data.reviews } })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);