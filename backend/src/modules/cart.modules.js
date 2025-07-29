import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Refers to your Product model
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1,
    },

    price: {
        type: Number,
        required: true,
    }
}, { _id: false }); 

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Refers to your User model
            required: true,
            unique: true, // A user can only have one cart
        },
        items: [cartItemSchema], // Array of products in the cart
    },
    {
        timestamps: true,
    }
);

export const Cart = mongoose.model('Cart', cartSchema);