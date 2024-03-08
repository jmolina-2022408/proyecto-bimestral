'use strict';

import Cart from './cart.model.js';

export const createCart = async (req, res) => {
    try {
        let { product, quantity } = req.body;
        let user = req.user.id
        let cart = await Cart.findOne({ user: user });

        if (!cart) {
            cart = new Cart({ user: user, products: [] });
        }

        let productIndex = cart.products.findIndex(item => item.product == product);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += parseInt(quantity);
        } else {
            cart.products.push({ product: product, quantity });
        }

        await cart.save();

        return res.status(200).send({ message: 'Product added to the cart', cart, productIndex });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Product not added' });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        let { id } = req.params;
        let user = req.user.id;
        let cart = await Cart.findOne({ user: user });

        if (!cart) {
            return res.status(404).send({ message: 'User cart not found' });
        }

        let product = cart.products.findIndex(item => item.product == id);

        if (product === -1) {
            return res.status(404).send({ message: 'Product not found in the cart' });
        }

        cart.products = cart.products.filter(item => item.product != id);

        await cart.save();

        return res.status(200).send({ message: 'Product removed from the cart' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error removing product from cart' });
    }
}

export const deleteCart = async (req, res) => {
    try {
        let user = req.user.id;

        let deletedCart = await Cart.findOneAndDelete({ user: user });

        if (!deletedCart) {
            return res.status(404).send({ message: 'User cart not found' });
        }

        return res.status(200).send({ message: 'Cart deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting cart', err });
    }
}
