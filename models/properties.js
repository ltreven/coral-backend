const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    type: String,
    rent: Number,
    size: Number,
    sizeUnit: String,
    bedrooms: Number,
    bathrooms: Number,
    address: {
        formatted: String,
        street: String,
        streetNumber: String,
        additionalInfo: String,
        postalCode: String,
        city: String,
        country: String,
        latitude: Number,
        longitude: Number
    },
    lift: Boolean,
    petfriendly: Boolean,
    furnitured: Boolean,
    nearMetroStation: Boolean,
    description: String,
    status: String,
    title: String,
    tags: { type: [String], index: true },
    imageURLs: { type: [String], index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
}
);

module.exports = mongoose.model('Property', schema);
