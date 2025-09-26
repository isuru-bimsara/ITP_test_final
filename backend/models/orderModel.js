
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    stockItem: { type: mongoose.Schema.Types.ObjectId, ref: 'StockItem', default: null },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true }
});

const CustomerOrderDetailsSchema = new mongoose.Schema({
    productId: String,
    productName: String,
    selectedColor: String,
    selectedWaist: Number,
    selectedInseam: String,
    customerRequirements: String,
    sampleDesignImage: String,
    uploadedImageName: String,
    customerName: String,
    customerEmail: String,
    customerPhone: String
});

const OrderSchema = new mongoose.Schema({
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    items: [ItemSchema],
    status: { type: String, default: 'Pending' },
    notes: { type: String },
    customerOrderDetails: CustomerOrderDetailsSchema,
    orderedAt: { type: Date, default: Date.now }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Order', OrderSchema);