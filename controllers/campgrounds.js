// list all campgrounds
const { cloudinary } = require('../cloudinary');
const Campground = require('../models/CampModel');
const Geocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = Geocoding({ accessToken: mapboxToken });

module.exports.list = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/list', { campgrounds })
}

module.exports.newPage = (req, res) => {
    res.render('campgrounds/new')
}

// take new data and add it into database
module.exports.new = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    console.log(req.body.location)
    const newCamp = new Campground(req.body);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.owner = req.user._id;

    await newCamp.save()
    req.flash('success', 'Successfully edited!');
    res.redirect(`/campgrounds/${newCamp._id}`)
}

// jump to specific page of each campground
module.exports.show = async (req, res) => {
    const { id } = req.params;
    const campground = await (await Campground.findById(id).populate({
        path: 'reviews', populate: ({ path: 'owner' })
    }).populate('owner'));
    if (!campground) {
        req.flash('error', 'Campground not found!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
    // res.send(campground)
}

// jump to editing page
module.exports.editPage = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground not found!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

// take the edited data and update it in database
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const newCamp = await Campground.findByIdAndUpdate(id, { ...req.body });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.img.push(...imgs);
    await newCamp.save();
    if (req.body.deleteImg) {
        for (let filename of req.body.deleteImg) {
            console.log(filename)
            await cloudinary.uploader.destroy(filename);
        }
        await newCamp.updateOne({ $pull: { img: { filename: { $in: req.body.deleteImg } } } })
    }
    req.flash('success', 'Successfully updated!');
    res.redirect(`/campgrounds/${id}`)
}

// delete campground
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted!');
    res.redirect('/campgrounds')
}