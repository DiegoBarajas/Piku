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
    cloudant();
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
            const db = cloudant.db.use("piku_clases");

            console.log("Obteniendo documento de las Base de datos");
            r = await db.get(req.session.user_classcode);
            req.session.class_id = r._id;
            req.session.class_classname = r.classname;
            req.session.class_description = r.description;
            req.session.class_grade = r.grade;
            req.session.class_group = r.group;
            req.session.class_turn = r.turn;
            req.session.class_school = r.school;
            //Nombre de la materia
            req.session.subject_name1 = r.subject1.subject_name;
            req.session.subject_name2 = r.subject2.subject_name;
            req.session.subject_name3 = r.subject3.subject_name;
            req.session.subject_name4 = r.subject4.subject_name;
            req.session.subject_name5 = r.subject5.subject_name;
            req.session.subject_name6 = r.subject6.subject_name;
            req.session.subject_name7 = r.subject7.subject_name;
            req.session.subject_name8 = r.subject8.subject_name;
            req.session.subject_name9 = r.subject9.subject_name;
            req.session.subject_name10 = r.subject10.subject_name;
            //Posts
            req.session.subject_post1 = r.subject1.posts;
            req.session.subject_post2 = r.subject2.posts;
            req.session.subject_post3 = r.subject3.posts;
            req.session.subject_post4 = r.subject4.posts;
            req.session.subject_post5 = r.subject5.posts;
            req.session.subject_post6 = r.subject6.posts;
            req.session.subject_post7 = r.subject7.posts;
            req.session.subject_post8 = r.subject8.posts;
            req.session.subject_post9 = r.subject9.posts;
            req.session.subject_post10 = r.subject10.posts;
            

            res.render("clase/index",{classcode: req.session.class_id, description: req.session.class_description, classname:req.session.class_classname, grade: req.session.class_grade, group: req.session.class_group, turn: req.session.class_turn, school: req.session.class_school, materia1: req.session.subject_name1, materia2: req.session.subject_name2, materia3: req.session.subject_name3, materia4: req.session.subject_name4, materia5: req.session.subject_name5, materia6: req.session.subject_name6, materia7: req.session.subject_name7, materia8: req.session.subject_name8, materia9: req.session.subject_name9, materia10: req.session.subject_name10});
        }catch(err){
            console.log(err);
            res.send("Esa clase no existe");
        } 
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
        console.log(sub_post.post1);
    }
});

//------------------------------------------------------------

module.exports = router;