const express = require("express");
const session = require("express-session")
const Cloudant = require ("@cloudant/cloudant");

const router = express.Router();

router.use(session({
    secret: "e6fwf5di2h",
    resave: false,
    saveUninitialized: false
}));

//-------------------- /app/clase --------------------
router.get("/",(req,res)=>{
    if(req.session.class_classname || req.session.class_grade || req.session.class_group){
        res.render("clase/index",{classcode: req.session.class_id, description: req.session.class_description, classname:req.session.class_classname, grade: req.session.class_grade, group: req.session.class_group, turn: req.session.class_turn, school: req.session.class_school, materia1: req.session.subject_name1, materia2: req.session.subject_name2, materia3: req.session.subject_name3, materia4: req.session.subject_name4, materia5: req.session.subject_name5, materia6: req.session.subject_name6, materia7: req.session.subject_name7, materia8: req.session.subject_name8, materia9: req.session.subject_name9, materia10: req.session.subject_name10});
    }else if(!req.session.class_classname || req.session.class_grade || req.session.class_group){
        res.send("Esa clase no existe");
    }
});

//-------------------- Informacion de la clase --------------------
router.get("/info",(req,res)=>{
    res.render("clase/info",{classcode: req.session.class_id, description: req.session.class_description, classname:req.session.class_classname, grade: req.session.class_grade, group: req.session.class_group, turn: req.session.class_turn, school: req.session.class_school});
});

//-------------------- Materias --------------------
router.get("/subject/:nc",(req,res)=>{
    var ns = req.url.split("/");
    ns = ns[2];
    var sub_name = eval("req.session.subject_name"+""+ns+"");
    var sub_post = eval("posts: req.session.subject_post"+""+ns+"");
    if(sub_name == ""){
        res.redirect("/app/clase")
    }else if(sub_name !== ""){
        res.render("clase/subject",{subject_name: sub_name});
    }
});

//------------------------------------------------------------

module.exports = router;