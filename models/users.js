const mongoose = require('mongoose');
const passLocalMong = require('passport-local-mongoose');

const schema = new mongoose.Schema({
    facebookId: String,
    firstName: {
        type: String,
        required: false,
        get: capitalizeFirstLetter
    },
    lastName: {
        type: String,
        required: false,
        get: capitalizeFirstLetter
    },
    birthday: Date,
    phoneCountryId: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    aboutYou: {
        type: String,
        required: false
    },
}, {
    timestamps: true
}
);

schema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

function capitalizeFirstLetter(v) {
    // Convert 'bob' -> 'Bob'
    return v.charAt(0).toUpperCase() + v.substr(1);
}

// adds username (and password, if any)
// social login doesn't have password
schema.plugin(passLocalMong);

module.exports = mongoose.model('User', schema);