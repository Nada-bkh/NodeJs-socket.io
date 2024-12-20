var express= require("express")
var router= express.Router()
const { showEvent }= require('../routes/events')
router.get('/', (req, res) => {
    res.render('list.twig');
});
module.exports= router