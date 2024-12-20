const mongoose = require('mongoose');
const yup = require('yup');

const event = new mongoose.Schema(
    {
        Title: String,
        Type: Number,
        Ticket_price: Number,
        Capacity: Number
    }
);
const Event = mongoose.model("events", event);

const eventSchema = yup.object({
    body: yup.object({
        eventCapacity: yup.number().min(0).required(),
        eventTitle: yup.string().required(),
        eventTicket_price: yup.number().required(),
        eventType: yup.number(1,2,3).required
    })
});
module.exports = {Event, eventSchema}