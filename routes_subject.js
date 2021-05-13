const express = require("express");
const router = express.Router();

//-------------------- Materias --------------------
router.get("/:nc",(req,res)=>{
    var ns = req.url.split("/");
    ns = ns[1];
    var sub_name = eval("req.session.subject_name"+""+ns+"");
    if(sub_name == ""){
        res.redirect("/app/clase")
    }else if(sub_name !== ""){
        res.render("subject/subject",{subject_name: sub_name, ns: ns});
    }
});

//---------------------- Nueva publicacion -----------------------
router.get("/:nc/new_post",(req,res)=>{
    var ns = req.url.split("/");
    ns = ns[1];
    var sub_name = eval("req.session.subject_name"+""+ns+"");
    console.log(ns);
    res.render("subject/new_post",{sub_name: sub_name, ns: ns});
});


//-------------------- Creando publicacion en la DB ----------------------------
router.post("/:nc/create_post",(req,res)=>{
    var posts = "NAME: " + req.body.post_name + "CONTENT: "+ req.body.content;;
    res.send(posts)
});
module.exports = router;