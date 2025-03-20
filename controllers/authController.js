const bcrypt = require('bcryptjs');
const db = require('../config/db'); 

// Signup
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        await db.none(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
};

// Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user from the database
        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

        // Check if user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Store user session
        req.session.user = { id: user.id, name: user.name, email: user.email };

        res.json({ message: 'Login successful', user: req.session.user });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Error logging in' });
    }
};

// Logout
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
};
