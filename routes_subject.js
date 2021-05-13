const express = require("express");
const router = express.Router();
const Cloudant = require ("@cloudant/cloudant");

//-------------------- Materias --------------------
router.get("/:nc",(req,res)=>{
    var ns = req.url.split("/");
    ns = ns[1];
    var sub_name = eval("req.session.subject_name"+""+ns+"");
    if(sub_name == ""){
        res.redirect("/app/clase")
    }else if(sub_name !== ""){
        cloudant_rpd();
        async function cloudant_rpd(){
            try {
                console.log("Creando conexion con base de datos....");
                const cloudant = Cloudant({
                    url:"https://9f54e758-3ad6-4391-8439-003d07506891-bluemix.cloudantnosqldb.appdomain.cloud",
                    plugins:{
                        iamauth:{
                            iamApiKey: "BXXfOZYJWpnnPykjZcJSJ8pOtuuADMw9M_mrxZ0IRum0"
                        }
                    }
                });
                console.log("Conexion creada");

                const db = cloudant.db.use("piku_posts");
                
                console.log("Obteniendo documento de las Base de datos");
                posts = await db.partitionedList(""+req.session.class_id+""+"subject"+""+ns+"", {include_docs: true});
                
                res.render("subject/subject",{subject_name: sub_name, ns: ns, post: posts});
            }catch(err){
                console.log(err);
                res.render("subject/subject",{subject_name: sub_name, ns: ns});
            }
        }
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
    var ns = req.url.split("/");
    ns = ns[1];
    cloudant_nps();
    async function cloudant_nps(){
        try {
            console.log("Creando conexion con base de datos....");
            const cloudant = Cloudant({
                url:"https://9f54e758-3ad6-4391-8439-003d07506891-bluemix.cloudantnosqldb.appdomain.cloud",
                plugins:{
                    iamauth:{
                        iamApiKey: "BXXfOZYJWpnnPykjZcJSJ8pOtuuADMw9M_mrxZ0IRum0"
                    }
                }
            });
        console.log("Conexion creada");

        n1 = Math.random();
        n1 = n1 * Math.random();
        n1 = n1 * Math.random();
        n1 = n1 * Math.random();
        n1 = n1 * Math.random();
        n1 = n1 * Math.random();
        n1 = n1 * 100000000000000000;
        n1 = Math.round(n1);

        const db = cloudant.db.use("piku_posts");
        const doc_al = {
            "_id": ""+req.session.class_id+"subject"+""+ns+""+":"+n1+"",
            "post_name": req.body.post_name,
            "content": req.body.content,
            "created_by": req.session.user_name+" "+req.session.user_lastname
        };

        let rowen="";
        rowen = await db.insert(doc_al);
        console.log("Agregado a DB: ");

        console.log(rowen);
        res.redirect("/app/clase")

        }catch(err){
            console.log(err);
            res.redirect("/app");
        }
    }

});
module.exports = router;