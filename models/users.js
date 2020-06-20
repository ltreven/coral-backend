const mongoose = require('mongoose');
const passLocalMong = require('passport-local-mongoose');

const schema = new mongoose.Schema({
    facebookId: String,
    fullName: {
        type: String,
        required: false,
        get: capitalizeFirstLetter
    },
    birthday: Date,
    phoneCountryId: String,
    phoneNumber: String,
    aboutYou: String,
    picture: String
}, {
    timestamps: true
}
);

function capitalizeFirstLetter(v) {
    // Convert 'bob' -> 'Bob'
    return v.charAt(0).toUpperCase() + v.substr(1);
}

// adds username (and password, if any)
// social login doesn't have password
schema.plugin(passLocalMong);

module.exports = mongoose.model('User', schema);