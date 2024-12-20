const express = require('express');
const router = express.Router();
const {Event, eventSchema} = require('../models/Event');
const validate = require('../middlewares/validate');

router.get('/', async (req,res,next)=>{
    const events = await Event.find();
    res.json(events);
});

router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.render('eventDetails', { title: 'Event details', event });
    } else {
      res.status(404).send('Event not found');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/findByTitle/:title', async (req,res,next)=>{
    const events = await Event.find({Title : req.params['title']});
    res.json(events);
});

router.post('/add', validate(eventSchema), async (req, res, next)=>{
    const event = new Event({ 
        Title: req.body.eventTitle, 
        Type: req.body.eventType,
        Ticket_price: req.body.eventTicket_price,
        Capacity: req.body.eventCapacity
    });
    await event.save();
    res.send("Event has been created");
});

router.delete('/:id', async (req, res, next)=>{
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.send('event has been deleted');
});

router.put("/:id", async (req, res, next) => {
    const { id } = req.params;
    const newEvent = await Event.findByIdAndUpdate(id, {
        Title: req.body.eventTitle, 
        Type: req.body.eventType,
        Ticket_price: req.body.eventTicket_price,
        Capacity: req.body.eventCapacity
    });
    res.json(newEvent);
})

router.patch('/buy/:id', async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId);

        if (event.Capacity <= 0) {
            return res.status(400).json({ message: "No tickets available" });
        }
        event.Capacity -= 1;
        await event.save();

        if (event.Capacity === 0) {
            io.emit('fullhouse', event);
        }

        res.status(200).json({ message: "Ticket purchased successfully", event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/apply_discount/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { discount } = req.body; 

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const discountAmount = (event.Ticket_price * discount) / 100;
        event.Ticket_price -= discountAmount;

        await event.save();

        res.status(200).json({
            message: "Discount applied successfully",
            event
        });
    } catch (err) {
        next(err);
    }
});


module.exports = router;
