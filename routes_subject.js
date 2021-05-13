const express = require("express");
const router = express.Router();

//-------------------- Materias --------------------
router.get("/:nc",(req,res)=>{
    var ns = req.url.split("/");
    ns = ns[1];
    var sub_name = eval("req.session.subject_name"+""+ns+"");
    console.log(ns);
    if(sub_name == ""){
        res.redirect("/app/clase")
    }else if(sub_name !== ""){
        res.render("subject/subject",{subject_name: sub_name});
    }
});

//------------------------------------------------------------

module.exports = router;