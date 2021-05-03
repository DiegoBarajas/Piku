const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("Hola");
    console.log(req.session.user_id);
});

module.exports = router;