const User = require('../models/UserData');

const signupUser = async (req, res) => {
    const { name, email, password, contact } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ name, email, password, contact });
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.password !== password) return res.status(401).json({ message: 'Incorrect password' });

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { signupUser, loginUser };