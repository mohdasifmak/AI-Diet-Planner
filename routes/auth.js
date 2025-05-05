const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Show registration page
router.get('/', (req, res) => {
    res.render('register');
});

// Handle registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ email, name });
        await User.register(user, password);
        passport.authenticate('local')(req, res, () => {
            res.redirect('/dashboard');
        });
    } catch (err) {
        console.error(err);
        res.send('Error during registration');
    }
});

// Show login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

// Handle logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

module.exports = router;

