const Order = require('../model/order');

const sendEmail = require('../utils/sendMail');

const normalizeStatus = (status) => {
    if (typeof status !== 'string') return 'pending';

    const normalized = status.trim().toLowerCase();
    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];

    return validStatuses.includes(normalized) ? normalized : 'pending';
};

//create a new order
const createOrder = async (req, res) => {
    try {
        const { items, address, paymentId, totalAmount } = req.body;
        if (!totalAmount || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }
        const order = new Order({
            items,
            user: req.user._id,
            address,
            paymentId,
            totalAmount
        });
        const createdOrder = await order.save();
        res.status(201).json({message: 'Order created successfully', order: createdOrder});
        sendEmail({
            email: req.user.email,
            subject: 'Order Confirmation',
            message: `Hi ${req.user.name},\n\nThank you for your order. Your order has been received and is being processed.\n\nOrder Details:\nTotal Price: ₹${totalAmount}\nShipping Address: ${address.fullName}, ${address.street}, ${address.city}, ${address.postalCode}, ${address.country}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nShopZ Team`
          }).then(() => {
            console.log(`Order confirmation email sent to ${req.user.email} for order ${createdOrder._id}`); 
          }).catch((emailError) => {
            console.error(`Failed to send order email to ${req.user.email}:`, emailError.message || emailError);
          }
        
        );        

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get my orders

const myOrders = async (req, res) => {
    try{
        const orders = await Order.find({ user: req.user._id }).populate('items.productId','name price');
        res.json(orders);

    }catch(error){
        res.status(500).json({message:'Error fetching orders',error})
    }
};

//get all orders (admin only)
const getOrders = async (req, res) => {
    try{
        const orders = await Order.find({}).populate('user','id name email').populate('items.productId','name price');
        res.json(orders);
    }catch(error){
        res.status(500).json({message:'Error fetching orders',error})
    }
};


//update order status (admin only)
const updateOrderStatus = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({message:'Order not found'});
        }
        order.status = normalizeStatus(req.body.status);
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }catch(error){
        res.status(500).json({message:'Error updating order status',error})
    }
};

//cancel an order (user or admin)
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const isOwner = order.user && order.user._id && order.user._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        if (order.status === 'shipped' || order.status === 'delivered') {
            return res.status(400).json({ message: 'Order cannot be cancelled after shipping/delivery' });
        }

        order.status = 'cancelled';
        const updatedOrder = await order.save();
        res.json({ message: 'Order cancelled successfully', order: updatedOrder });
        sendEmail({
            email: order.user?.email || req.user.email,
            subject: 'Order Cancelled',
            message: `Hi ${order.user?.name || req.user.name},\n\nYour order has been cancelled successfully.\n\nOrder ID: ${order._id}\nTotal Amount: ₹${order.totalAmount}\n\nThanks,\nShopZ Team`
        }).then(() => {
            console.log(`Order cancellation email sent to ${order.user?.email || req.user.email} for order ${updatedOrder._id}`);
        }).catch((emailError) => {
            console.error(`Failed to send cancellation email to ${order.user?.email || req.user.email}:`, emailError.message || emailError);
        });

    } catch (error) {
        res.status(500).json({ message: 'Error cancelling order', error });
    }
};

module.exports = { createOrder, myOrders, getOrders, updateOrderStatus, cancelOrder };