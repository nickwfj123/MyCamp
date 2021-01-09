if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Review = require('./models/Review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');

const campRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const mongoSanitize = require('express-mongo-sanitize');

const helmet = require('helmet');

const MongoDBstore = require('connect-mongo')(session);


const mongoose = require('mongoose');
const { contentSecurityPolicy } = require('helmet');

const dbUrl = process.env.dbUrl || 'mongodb://localhost:27017/yelp-camp';
// const localDB = 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
        console.log("Mongo Connected!")
    })
    .catch(err => {
        console.log("oh no, error!")
        console.log(err)
    })

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//     console.log('database connected!');
// })

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mongoSanitize());

app.use(helmet({contentSecurityPolicy:false}));

const store = new MongoDBstore({
    url: dbUrl,
    secret: 'fangjiang',
    touchAfter: 24*60*60
});

store.on('error', function(e){
    console.log('session store error')
})

const sessionConfig = {
    store,
    name: 'kanbujianwo',
    secret: 'fangjiang',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // set cookie's expriation date: one week from now
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for flash, could be used by each file.
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use('/', campRoutes);
app.use('/', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

// no pages found
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "oh noooo, default error happens";
    res.status(statusCode).render('error', { err })
    // res.send('ohhhno')
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${3000}`)
})