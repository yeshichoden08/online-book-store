const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/authMiddleware'); // Ensure correct path

// Home route (only accessible by logged-in users)
router.get('/', isAuthenticated, (req, res) => {
    // Prevent caching of the home page by setting appropriate headers
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.render('home', { user: req.session?.user || null });
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error while logging out');
        }
        res.redirect('/auth/login'); // Redirect to login after logout
    });
});

module.exports = router;
