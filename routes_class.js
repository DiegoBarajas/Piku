const express = require("express");
const session = require("express-session");
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
    res.render("clase/info",{classcode: req.session.class_id, description: req.session.class_description, classname:req.session.class_classname, grade: req.session.class_grade, group: req.session.class_group, turn: req.session.class_turn, school: req.session.class_school, usertype: req.session.user_type});
});

//-------------------- Editar Informacion de la clase --------------------
router.get("/edit_clase",(req,res)=>{
    if(req.session.user_type == "maestro"){
        res.render("clase/edit_info",{classname: req.session.class_classname, description: req.session.class_description, grade: req.session.class_grade, group: req.session.class_group, turn: req.session.class_turn, school: req.session.class_school});
    }else if(req.session.user_type == "alumno"){
        res.redirect("/app/clase");
    }
});

//-------------------- Editando Informacion de la clase --------------------
router.post("/clase_edited",(req,res)=>{
    if(req.session.user_type == "maestro"){
        cloudant_ep();
        async function cloudant_ep(){
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
                console.log("Obteniendo DB");
                const db = cloudant.db.use("piku_clases");
                let user="";
                user= await db.get(req.session.user_classcode);
                console.log("DB Obtenida");
                doc_ed = user;

                doc_ed["_rev"]=user._rev
                if(req.body.classname == ""){
                    doc_ed.classname = req.session.class_classname;
                }else if(req.body.classname !== ""){
                    doc_ed.classname = req.body.classname;
                }
                if(req.body.description == ""){
                    doc_ed.description = req.session.class_description;
                }else if(req.body.description == " "){
                    doc_ed.description = ""
                }else if(req.body.description !== ""){
                    doc_ed.description = req.body.description;
                }
                if(req.body.grade == ""){
                    doc_ed.grade = req.session.class_grade;
                }else if(req.body.grade !== ""){
                    doc_ed.grade = req.body.grade;
                }
                if(req.body.group == ""){
                    doc_ed.group = req.session.class_group;
                }else if(req.body.group !== ""){
                    doc_ed.group = req.body.group;
                }
                if(req.body.turn == ""){
                    doc_ed.turn = req.session.class_turn;
                }else if(req.body.turn !== ""){
                    doc_ed.turn = req.body.turn;
                }
                if(req.body.school == ""){
                    doc_ed.school = req.session.class_school;
                }else if(req.body.school !== ""){
                    doc_ed.school = req.body.school;
                }

                user = await db.insert(doc_ed);
                console.log("Documento editado: ")
                console.log(user);

                res.redirect("/app/clase/info");
            }catch(err){
                console.log(err);
                res.redirect("/app");
            }
        }
    }else if(req.session.user_type == "alumno"){
        res.redirect("/app/clase");
    }
});

//-------------------- Confirmacion de eliminar clase --------------------
router.get("/del_confirm",(req,res)=>{
    if(req.session.user_type == "maestro"){
        res.render("clase/del_confirm");
    }else if(req.session.user_type == "alumno"){
        res.render("/app");
    }
});

//-------------------- Borrar clase ---------------------
router.get("/del_class",(req,res)=>{
    if(req.session.user_type == "maestro"){
        cloudant_ecs();
        async function cloudant_ecs(){
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

                const db = cloudant.db.use("piku_users");
                console.log("Obteniendo documento de las Base de datos");
                r = await db.get(req.session.user_id);
                console.log(r);

                doc_ed = r;
                doc_ed["_rev"]=r._rev
                doc_ed.classcode = null;
                r = await db.insert(doc_ed);
                console.log("Documento editado: ")
                console.log(r);
                
                res.redirect("/app/delete_clase");

            }catch(err){
                console.log("Error: " + err);
                res.redirect("/app");
            }
        }
    }else if(req.session.user_type == "alumno"){
        res.redirect("/app");
    }
});

//-------------------- Salir de clase--------------------
router.get("/salir_class",(req,res)=>{
    if(req.session.user_type == "maestro"){
        cloudant_z();
        async function cloudant_z(){
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

                const db = cloudant.db.use("piku_users");
                console.log("Obteniendo documento de las Base de datos");
                r = await db.get(req.session.user_id);
                console.log(r);

                doc_ed = r;
                doc_ed["_rev"]=r._rev
                doc_ed.classcode = null;
                r = await db.insert(doc_ed);
                console.log("Documento editado: ")
                console.log(r);
                
                res.redirect("/app");

            }catch(err){
                console.log("Error: " + err);
                res.redirect("/app");
            }
        }
    }else if(req.session.user_type == "alumno"){
        cloudant_ecs();
        async function cloudant_ecs(){
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

                const db = cloudant.db.use("piku_users");
                console.log("Obteniendo documento de las Base de datos");
                r = await db.get(req.session.user_id);
                console.log(r);

                doc_ed = r;
                doc_ed["_rev"]=r._rev
                doc_ed.classcode = null;
                r = await db.insert(doc_ed);
                console.log("Documento editado: ")
                console.log(r);
                
                res.redirect("/app");
            }catch(err){
                console.log("Error: " + err);
                res.redirect("/app");
            }
        }
    }
});


//-------------------- Materias --------------------
router.get("/subject/:nc",(req,res)=>{
    var ns = req.url.split("/");
    ns = ns[2];
    var sub_name = eval("req.session.subject_name"+""+ns+"");
    if(sub_name == ""){
        res.redirect("/app/clase")
    }else if(sub_name !== ""){
        res.render("clase/subject",{subject_name: sub_name});
    }
});

//------------------------------------------------------------

module.exports = router;