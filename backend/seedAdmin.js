require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        const admins = [
            {
                name: "Admin One",
                email: "admin1@carecube.com",
                password: "12345",
                role: "admin"
            },
            {
                name: "Admin Two",
                email: "admin2@carecube.com",
                password: "12345",
                role: "admin"
            }
        ];

        for (const admin of admins) {
            const exists = await User.findOne({ email: admin.email });
            if (!exists) {
                await User.create(admin);
                console.log(`Created admin: ${admin.email}`);
            } else {
                console.log(`Admin already exists: ${admin.email}`);
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admins:', error);
        process.exit(1);
    }
};

seedAdmins();
