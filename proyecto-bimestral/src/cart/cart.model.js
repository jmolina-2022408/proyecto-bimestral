import { Schema, model } from 'mongoose'

const cartSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            required: true
        }
    }],
    date: {
        type: Date,
        default: Date.now(),
        required: true
    }
}, {
    versionKey: false
})

export default model('cart', cartSchema)