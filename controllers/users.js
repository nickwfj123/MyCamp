const User = require('../models/User');

module.exports.registerPage = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const hashedUser = await User.register(user, password);
        req.login(hashedUser, err => {
            if (err) return next(err);
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginPage = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds' ;
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Good Bye!');
    res.redirect('/login');
}