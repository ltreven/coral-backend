const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    type: String,
    rent: Number,
    size: Number,
    sizeUnit: String,
    bedrooms: Number,
    bathrooms: Number,
    address: {
        typeOfStreet: String,
        streetName: String,
        buildingNumber: String,
        floorNumber: String,
        doorNumber: String,
        postalCode: String,
        city: String,
        province: String,
        region: String,
        country: String,
        latitude: Number,
        longitude: Number
    },
    lift: Boolean,
    petfriendly: Boolean,
    furnitured: Boolean,
    nearMetroStation: Boolean,
    description: String,
    title: String,
    tags: { type: [String], index: true },
    imageURLs: { type: [String], index: true },
    ownerId: String
}, {
    timestamps: true
}
);

module.exports = mongoose.model('Property', schema);
