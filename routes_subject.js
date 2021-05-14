const express = require("express");
const router = express.Router();
const Cloudant = require ("@cloudant/cloudant");

router.use(express.json())
router.use(express.urlencoded({extended: true}));


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
                res.render("subject/subject",{subject_name: sub_name, ns: ns, post: posts, user_type: req.session.user_type});
            }catch(err){
                console.log(err);
                res.render("subject/subject",{subject_name: sub_name, ns: ns, user_type: req.session.user_type});
            }
        }
    }
});

//---------------------- Nueva publicacion -----------------------
router.get("/:nc/new_post",(req,res)=>{
    if(req.session.user_type == "alumno"){
        res.redirect("/app/clase");
    }else if(req.session.user_type == "maestro"){
        var ns = req.url.split("/");
        ns = ns[1];
        var sub_name = eval("req.session.subject_name"+""+ns+"");
        res.render("subject/new_post",{sub_name: sub_name, ns: ns});
    }
});


//-------------------- Creando publicacion en la DB ----------------------------
router.post("/:nc/create_post",(req,res)=>{
    if(req.session.user_type == "maestro"){
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
    }else if(req.session.user_type == "alumno"){
        res.redirect("/app/clase");
    }
});

//----------------- Editar posts ----------------------
router.get("/:nc/edit",(req,res)=>{
    if(req.session.user_type == "alumno"){
        res.redirect("/app/clase");
    }else if(req.session.user_type == "maestro"){
        var idp = req.url.split("/");
        idp = idp[1];
        console.log(idp);cloudant();
        async function cloudant(){
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
                xy = await db.get(idp);
                res.render("subject/edit_post",{idp: idp, postname: xy.post_name, content: xy.content});
            }catch(err){
                console.log(err);
                res.render("/app/clase");
            } 
        }
    }
});

//------------------- Editar post en DB ---------------------
router.post("/:nc/changing_post",(req,res)=>{
    if(req.session.user_type == "alumno"){
        res.redirect("/app/clase");
    }else if(req.session.user_type == "maestro"){
        var idp = req.url.split("/");
        idp = idp[1];
        cloudant_edps();
        async function cloudant_edps(){
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
                rs = await db.get(idp);
                console.log(rs);

                doc_ed = rs;
                doc_ed["_rev"]=rs._rev
                if(req.body.post_name == ""){
                    doc_ed.post_name = rs.post_name;
                }else if(req.body.post_name !== ""){
                    doc_ed.post_name = req.body.post_name;
                }
                if(req.body.content == ""){
                    doc_ed.content = rs.content;
                }else if(req.body.content !== ""){
                    doc_ed.content = req.body.content;
                }
                rs = await db.insert(doc_ed);
                console.log("Documento editado: ")
                console.log(rs);
                res.redirect("/app/clase");
                
            }catch(err){
                console.log(err);
                res.redirect("/app")
            }
        }
    }
});

module.exports = router;