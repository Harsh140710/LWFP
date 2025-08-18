import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product', // Refers to your Product model
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Refers to your User model
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please add a rating to your review'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot be more than 5'],
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [100, 'Review comment cannot exceed 100 characters'],
        },
    },
    {
        timestamps: true,
    }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
