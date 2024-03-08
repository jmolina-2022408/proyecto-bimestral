'use strict';

import Category from './category.model.js';
import Product from '../product/product.model.js';
import { checkUpdate } from '../utils/validator.js';

export const createCategory = async (req, res) => {
    try {
        let data = req.body;
        let category = new Category(data);
        await category.save();
        return res.send({ message: 'Category created successfully', category });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating category', err });
    }
}

export const getAllCategories = async (req, res) => {
    try {
        let categories = await Category.find();
        return res.send({ message: 'This is the list of categories', categories });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting categories', err });
    }
}

export const updateCategory = async (req, res) => {
    try {
        let data = req.body;
        let { id } = req.params;
        let update = checkUpdate(data, false);
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' });
        let updatedCategory = await Category.findOneAndUpdate({ _id: id }, data, { new: true });
        if (!updatedCategory) return res.status(404).send({ message: 'Category not found and not updated' });
        return res.send({ message: 'Category updated successfully', updatedCategory });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating category', err });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        let { id } = req.params;
        let defaultCategory = await Category.findOne({ name: 'Default' });
        if (!defaultCategory) return res.status(500).send({ message: 'Default category not found' });
        let deletedCategory = await Category.deleteOne({ _id: id });
        if (deletedCategory.deleteCount === 0) return res.status(404).send({ message: 'Category not found' });
        await Product.updateMany({ category: id }, { category: defaultCategory._id });
        return res.send({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting category', err });
    }
}

let defaultCategory = {
    name: 'Default',
    description: 'Default category'
}

export const categoryDefault = async (req, res) => {
    try {
        let category = await Category.findOne({ name: defaultCategory.name });
        if (category) {
            console.log('This category already exists');
        } else {
            let newCategory = await Category.create(defaultCategory);
            console.log(`A default category is created, name:${newCategory.name} | _id:${newCategory._id}`);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error registering category' });
    }
}