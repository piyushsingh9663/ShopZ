const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../model/order');
const User = require('../model/user');
dotenv = require('dotenv');
dotenv.config();

const createOrder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const options = {
            amount: req.body.amount * 100, // amount in the smallest currency unit
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex')
        };
        const order = await instance.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');
        if (generated_signature === razorpay_signature) {
            // Payment is successful, return payment ID to frontend
            res.status(200).json({ 
                message: 'Payment verified successfully',
                paymentId: razorpay_payment_id
            });  
        } else {
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, verifyPayment };