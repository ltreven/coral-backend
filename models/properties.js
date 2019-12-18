const mongoose = require('mongoose');

const schema = new mongoose.Schema({    
    type: String,
    value: Number,
    size: Number,
    rooms: Number,
    bathrooms: Number,
    floor: String,
    petfriendly: Boolean,
    furnitured: Boolean,
    nearMetroStation: Boolean,
    description: String,
    latitude: Number,
    longitude: Number,
    tags: { type: [String], index: true },
    imageURLs: { type: [String], index: true },
    ownerId: String
}, {
        timestamps: true
    }
);

module.exports = mongoose.model('Property', schema);
