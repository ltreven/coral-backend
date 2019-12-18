const mongoose = require('mongoose');

const schema = new mongoose.Schema({    
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        get: capitalizeFirstLetter
    },
    lastName: {
        type: String,
        required: true,
        get: capitalizeFirstLetter
    },
    birthday: Date,
    email: {
        type: String,
        required: true,
        unique:true
    },
    phoneCountryId: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    }
    //adress: []
    //role (renter, owner?)
}, {
        timestamps: true
    }
);

schema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

function capitalizeFirstLetter(v) {
    // Convert 'bob' -> 'Bob'
    return v.charAt(0).toUpperCase() + v.substr(1);
}

module.exports = mongoose.model('Person', schema);
