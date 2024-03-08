'use strict';

import PDFDocument from 'pdfkit';
import fs from 'fs';
import Invoice from './invoice.model.js';
import Product from '../product/product.model.js';
import Cart from '../cart/cart.model.js';

export const createInvoice = async (req, res) => {
    try {
        let user = req.user.id;
        let id = req.params.id;
        let cart = await Cart.findOne({ _id: id, user: user }).populate('products.product');

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }

        let total = cart.products.reduce((acc, item) => {
            let subTotal = item.product.price * item.quantity;
            item.subTotal = subTotal;
            return acc + subTotal;
        }, 0);

        for (let item of cart.products) {
            let product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }
            if (product.stock < item.quantity) {
                return res.status(400).send({ message: `Insufficient stock for ${product.name}` });
            }
            product.stock -= item.quantity;
            await product.save();
        }

        let invoice = new Invoice({
            user: user,
            cart: id,
            total,
        });

        await invoice.save();

        let pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(`invoice_${invoice._id}.pdf`));

        pdfDoc
            .font('Helvetica-Bold')
            .fontSize(16)
            .text('Proyecto Final - Primer Bimestre', { align: 'center' });
        pdfDoc.moveDown()

        pdfDoc
            .font('Helvetica-Bold')
            .fontSize(14)
            .text('Detalle Usuario', { align: 'center' });
        pdfDoc.moveDown()

        pdfDoc
            .fontSize(12)
            .text(`Nombre del usuario: ${req.user.name}`)
            .text(`Correo eléctronico del usuario: ${req.user.email}`)
            .text(`Número de télefono del usuario: ${req.user.phone}`)
            .text(`Dirección del usuario: ${req.user.direction}`);
        pdfDoc.moveDown()

        pdfDoc
            .font('Helvetica-Bold')
            .fontSize(14)
            .text('Detalle Producto', { align: 'center' });

        cart.products.forEach((item, index) => {
            pdfDoc.moveDown();
            pdfDoc
                .font('Helvetica')
                .fontSize(12)
                .text(`Producto #${index + 1}`)
                .text(`  Nombre del producto: ${item.product.name}`)
                .text(`  Descripción del producto: ${item.product.description}`)
                .text(`  Precio del producto: Q.${item.product.price}`)
                .text(`  Cantidad del producto: ${item.quantity}`)
                .text(`  Subtotal: Q.${item.subTotal}`);
        });

        pdfDoc.moveDown();
        pdfDoc
            .font('Helvetica-Bold')
            .fontSize(14)
            .text(`Total: Q.${total}`, { align: 'right' });

        pdfDoc.end();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice._id}.pdf`);

        pdfDoc.pipe(res);

        for (let item of cart.products) {
            let product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }

            product.sold += 1;
            await product.save();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error creating invoice and generating PDF' });
    }
}
