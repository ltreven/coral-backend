const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    read: Boolean,
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('Chat', schema);
