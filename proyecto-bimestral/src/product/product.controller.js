'use strict'

import Product from './product.model.js'
import Category from '../category/category.model.js'
import { checkUpdate } from '../utils/validator.js'

export const createProduct = async (req, res) => {
    try {
        let data = req.body
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'Category not found' })
        let product = new Product(data)
        await product.save()
        return res.send({ message: 'Product created successfully', product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating product', err })
    }
}

export const getAllProducts = async (req, res) => {
    try {
        let products = await Product.find().populate('category', ['name'])
        return res.send({ message: 'This is the list of products', products })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting products', err })
    }
}

export const getProduct = async (req, res) => {
    try {
        let { name } = req.body;
        let regex = new RegExp(name, 'i');
        let product = await Product.find({ name: regex })
        if (!product || product.length === 0) return res.status(404).send({ message: 'Product not found' })
        return res.send({ message: 'This is the list of product', product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting product', err })
    }
}

export const updateProduct = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let update = checkUpdate(data, false)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updatedProduct = await Product.findOneAndUpdate({ _id: id }, data, { new: true }).populate('category', ['name', 'description'])
        if (!updatedProduct) return res.status(404).send({ message: 'Product not found and not updated' })
        return res.send({ message: 'Product updated successfully', updatedProduct })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating product', err })
    }
}

export const getOutOfStock = async (req, res) => {
    try {
        let outOfStockProducts = await Product.find({ stock: { $lte: 0 } });
        return res.send({ message: 'Out of stock products', products: outOfStockProducts })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting out of stock products', err })
    }
}

export const getBestSelling = async (req, res) => {
    try {
        // Consultar los productos ordenados por el atributo sold de forma descendente
        let bestSellingProducts = await Product.find().sort({ sold: -1 });
        return res.status(200).send({ bestSellingProducts });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching best selling products' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        let { id } = req.params
        let deletedProduct = await Product.deleteOne({ _id: id })
        if (deletedProduct.deleteCount === 0) return res.status(404).send({ message: 'Product not found' })
        return res.send({ message: 'Product deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting product', err })
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        let { id } = req.params
        let products = await Product.find({ category: id }).populate('category', ['name'])
        if (products.length === 0) {
            return res.status(404).send({ message: 'No products found for the specified category' })
        }
        return res.send({ message: 'Products found for the specified category', products })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting products by category', error })
    }
}

export const addStock = async (req, res) => {
    try {
        let { id } = req.params
        let { quantity } = req.body;

        if (!id || !quantity || quantity <= 0) {
            return res.status(400).send({ message: 'Invalid data provided' });
        }

        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        product.stock += parseInt(quantity, 10);
        await product.save();

        return res.status(200).send({ message: 'Stock added successfully', updatedProduct: product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding stock', err });
    }
}