const mongoose = require('mongoose')
require('../db/mongoose')

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        required: true,
        type: String
    },
    available: {
        type: Boolean,
        default: true
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User