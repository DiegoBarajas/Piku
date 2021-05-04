const express = require("express");
var router = express.Router();

router.get("/",(req,res)=>{
    res.send("Clase");
});

module.exports = router;