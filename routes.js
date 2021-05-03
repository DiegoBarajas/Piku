const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("app/index",{name: req.session.user_name});
});

module.exports = router;