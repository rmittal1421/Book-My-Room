const mongoose = require ('mongoose')
const Booking = require ('../schema/booking')

mongoose.connect('mongodb://127.0.0.1:27017/booking-info', {
    useNewUrlParser: true,
    useCreateIndex: true,
})