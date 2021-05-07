const express = require("express");
var router = express.Router();

router.get("/",(req,res)=>{
    res.render("clase/index");
});

module.exports = router;