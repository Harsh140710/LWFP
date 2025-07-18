import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true, // Category names should typically be unique
            trim: true,
            maxLength: [50, 'Category name cannot exceed 50 characters'],
            lowercase: true, // Store category names in lowercase for consistent querying
            // text: true, // Optional: for full-text search on categories
        },
        slug: { // A URL-friendly version of the name, useful for routing
            type: String,
            unique: true, // Slugs should also be unique
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxLength: [200, 'Category description cannot exceed 200 characters'],
            default: '', // Default to empty string if no description
        },
        image: {
            public_id: { // Cloudinary public ID
                type: String,
                // required: true, // Make required if every category must have an image
            },
            url: { // Cloudinary URL
                type: String,
                // required: true, // Make required if every category must have an image
            },
        },
        // Optional: For nested categories (e.g., "Men's Watches" under "Luxury Watches")
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null, // Null if it's a top-level category
        },
        createdBy: { // To track which admin created the category
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Assuming 'User' model for admins with a 'role' field
            // required: true, // Make required if you want to track who created it
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Pre-save hook to generate a slug from the category name
categorySchema.pre('save', function(next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
    }
    next();
});

export const Category = mongoose.model('Category', categorySchema);