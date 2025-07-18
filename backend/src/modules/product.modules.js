import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Product title is required'],
            trim: true,
            unique: true, // Ensures no two products have the exact same title
            maxLength: [100, 'Product title cannot exceed 100 characters'], // Increased from 20 for more flexibility
            // Consider adding `index: true` for faster queries on title
            // text: true, // Uncomment if you enable full-text search
        }, 

        description: {
            type: String,
            required: [true, 'Product description is required'],
            trim: true,
            maxLength: [2000, 'Product description cannot exceed 2000 characters'], // Increased from 500
            // text: true, // Uncomment if you enable full-text search
        },

        brand: {
            type: String,
            required: [true, 'Brand is required'],
            trim: true,
        },

        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },

        discountPrice: {
            type: Number,
            default: 0,
            min: [0, 'Discount price cannot be negative'],
            validate: {
                validator: function(v) {
                    // Discount price must be 0 (no discount) OR less than the original price.
                    return v === 0 || v < this.price; 
                },
                message: 'Discount price must be 0 or less than the original price.'
            },
        },

        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },

        category: {
            // Using ObjectId reference is the best practice for categories
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Ensure you create a 'Category' model now
            required: [true, 'Category is required'],
        },
        
        images: [ 
            {
                public_id: { // Cloudinary public ID for deletion and management
                    type: String,
                    required: [true, "Image public ID is required"], // Make sure your upload process gets this
                },
                url: { // Cloudinary secure URL for displaying the image
                    type: String,
                    required: [true, "Image URL is required"],
                },
            },
        ],

        ratings: { 
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        numReviews: { // Total count of reviews
            type: Number,
            default: 0,
        },

        reviews: [ 
            {
                user: { // Reference to the User who made the review
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User', // Assuming User is your user model
                    required: true,
                },
                name: { // Reviewer's name (denormalized for display convenience)
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5,
                },
                comment: {
                    type: String,
                },
                createdAt: { // Timestamp for the review
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        isFeatured: {
            type: Boolean,
            default: false,
        },
        
        createdBy: { // User (admin/seller) who created this product
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // ⭐ RECOMMENDED: Reference 'User' model, and use roles to differentiate admins.
            required: true, // Yes, it's good practice to know who added a product
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

// Optional: Add text index for searchability (uncomment if you need full-text search)
// productSchema.index({ title: 'text', description: 'text', brand: 'text' });
// productSchema.index({ "reviews.comment": 'text' }); // Example: indexing review comments

export const Product = mongoose.model('Product', productSchema);