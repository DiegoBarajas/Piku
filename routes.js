const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("app/index",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode});
});
router.get("/myuser",(req,res)=>{
    res.render("app/myuser",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode, usertype: req.session.user_type});
});

module.exports = router;