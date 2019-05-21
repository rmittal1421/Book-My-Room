const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    room: {
        type: Number,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})

const Booking = mongoose.model('Booking', BookingSchema)

module.exports = Booking