import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../modules/user.modules.js'; // Adjust path if needed

dotenv.config({ path: '../../.env' }); // Load your environment variables

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = "harshsuthar6355@gmail.com";

const makeUserAdmin = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected for admin script.");

        const result = await User.updateOne(
            { email: ADMIN_EMAIL },
            { $set: { role: "admin" } }
        );

        if (result.matchedCount === 0) {
            console.log(`User with email ${ADMIN_EMAIL} not found.`);
        } else if (result.modifiedCount === 0) {
            console.log(`User ${ADMIN_EMAIL} is already an admin or no changes were made.`);
        } else {
            console.log(`Successfully updated ${ADMIN_EMAIL} to admin role.`);
        }

    } catch (error) {
        console.error("Error making user admin:", error);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected.");
    }
};

makeUserAdmin();