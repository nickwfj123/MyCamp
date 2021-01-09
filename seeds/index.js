// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

const Campground = require('../models/CampModel')
const cities = require('./cities')
const { descriptors, places } = require('./seedsHelper')

// const Geocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapboxToken = process.env.MAPBOX_TOKEN;
// const geoCoder = Geocoding({ accessToken: mapboxToken });


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => {
        console.log("Mongo Connected!")
    })
    .catch(err => {
        console.log("oh no, error!")
        console.log(err)
    })



const test = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 100; i++) {
        const randomDes = Math.floor(Math.random() * descriptors.length);
        const randomPla = Math.floor(Math.random() * places.length);
        const random1000 = Math.floor(Math.random() * 1000);

        // const geoData = await geoCoder.forwardGeocode({
        //     query: `${cities[random1000].city} ${cities[random1000].state}`,
        //     limit: 1
        // }).send();

        const city = new Campground({
            title: `${descriptors[randomDes]} ${places[randomPla]}`,
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            price: random1000,
            // geometry: geoData.body.features[0].geometry,
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude] },
            img: [
                {
                    url: 'https://res.cloudinary.com/nickwfj123/image/upload/v1610072921/YelpCamp/wtpimq4r85ez0hgrllft.jpg',
                    filename: 'YelpCamp/wtpimq4r85ez0hgrllft'
                }
            ],
            owner: '5ff607ad3646f51dd456683a',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores sequi temporibus vel iste repellat, repudiandae deserunt error, vero incidunt odit veniam. In qui quia earum laudantium est tempora, rem sapiente.'

        });
        await city.save()
        // console.log(`${cities[random1000].city} - ${cities[random1000].state} - ${random1000}`)
    }
}

test()
    .then(() => {
        mongoose.connection.close()
    })