const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv=require('dotenv')
dotenv.config()
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            const admin = new User({
                username: process.env.USER_NAME,
                email: process.env.EMAIL,
                password: process.env.PASSWORD, 
                role: 'admin'
            });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(admin.password, salt);

            await admin.save();
            console.log('Admin user created');
        }
    } catch (err) {
        console.error('Error seeding admin:', err.message);
    }
};

module.exports = seedAdmin;