import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Cart } from '../models/cart.models.js';
import { Product } from '../models/product.models.js';


const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Populate product details in the cart items
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price image stock');

    if (!cart) {
        // If cart doesn't exist, return an empty cart
        return res.status(200).json(new ApiResponse(200, { user: userId, items: [] }, 'Cart is empty'));
    }

    res.status(200).json(new ApiResponse(200, cart, 'Cart fetched successfully'));
});

const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !quantity || quantity <= 0) {
        throw new ApiError(400, 'Product ID and a positive quantity are required');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    if (product.stock < quantity) {
        throw new ApiError(400, `Not enough stock for ${product.name}. Available: ${product.stock}`);
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
        // Cart exists for user
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Product already in cart, update quantity
            cart.items[itemIndex].quantity += quantity;
            // Re-check stock after updating quantity
            if (product.stock < cart.items[itemIndex].quantity) {
                cart.items[itemIndex].quantity -= quantity; // Revert

                throw new ApiError(400, `Adding ${quantity} units would exceed stock for ${product.name}. Max available: ${product.stock - (cart.items[itemIndex].quantity - quantity)}`);
            }
        } else {
            // Product not in cart, add new item
            cart.items.push({ product: productId, quantity, price: product.price });
        }
    } else {
        // No cart for user, create a new one
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity, price: product.price }],
        });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');


    res.status(200).json(new ApiResponse(200, populatedCart, 'Item added to cart successfully'));
});

const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError(404, 'Cart not found for this user');
    }

    // Filter out the item to be removed
    const initialLength = cart.items.length;

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    if (cart.items.length === initialLength) {
        throw new ApiError(404, 'Product not found in cart');
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');


    res.status(200).json(new ApiResponse(200, populatedCart, 'Item removed from cart successfully'));
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body; // New desired quantity
    const userId = req.user._id;

    if (!productId || quantity === undefined || quantity < 0) { // Quantity can be 0 to remove item
        throw new ApiError(400, 'Product ID and a valid quantity are required');
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError(404, 'Cart not found for this user');
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
        if (quantity === 0) {
            // If quantity is 0, remove the item
            cart.items.splice(itemIndex, 1);
        } else {
            // Check stock before updating
            const product = await Product.findById(productId);
            if (!product) {
                throw new ApiError(404, 'Product not found');
            }
            if (product.stock < quantity) {
                throw new ApiError(400, `Cannot update quantity to ${quantity}. Only ${product.stock} available for ${product.name}`);
            }
            cart.items[itemIndex].quantity = quantity;
        }

    } else {
        throw new ApiError(404, 'Product not found in cart');
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');

    res.status(200).json(new ApiResponse(200, populatedCart, 'Cart item quantity updated successfully'));
});

const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOneAndDelete({ user: userId }); // Find and delete the cart document

    if (!cart) {
        throw new ApiError(404, 'Cart not found for this user');
    }

    res.status(200).json(new ApiResponse(200, { user: userId, items: [] }, 'Cart cleared successfully'));
});


export {
    getCart,
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    clearCart,
};