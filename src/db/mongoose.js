const mongoose = require('mongoose')
const Booking = require('../schema/booking')

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
})