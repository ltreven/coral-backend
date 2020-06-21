const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    message: {
        type: String,
        required: true
    },
    read: Boolean,
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('Chat', schema);
