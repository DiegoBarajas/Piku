const express = require("express");
const router_class = require("./routes_class");
const clases_middleware = require("./middlewares/clases");
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("app/index",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode});
});
router.get("/myuser",(req,res)=>{
    res.render("app/myuser",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode, usertype: req.session.user_type});
});

router.use("/clase", clases_middleware);
router.use("/clase", router_class);

module.exports = router;