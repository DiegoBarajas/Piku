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
            req.session.subject1_name = r.subject1.subject_name;
            req.session.subject2_name = r.subject2.subject_name;
            req.session.subject3_name = r.subject3.subject_name;
            req.session.subject4_name = r.subject4.subject_name;
            req.session.subject5_name = r.subject5.subject_name;
            req.session.subject6_name = r.subject6.subject_name;
            req.session.subject7_name = r.subject7.subject_name;
            req.session.subject8_name = r.subject8.subject_name;
            req.session.subject9_name = r.subject9.subject_name;
            req.session.subject10_name = r.subject10.subject_name;

            res.render("clase/index",{classcode: req.session.class_id, description: req.session.class_description, classname:req.session.class_classname, grade: req.session.class_grade, group: req.session.class_group, turn: req.session.class_turn, school: req.session.class_school, materia1: req.session.subject1_name, materia2: req.session.subject2_name, materia3: req.session.subject3_name, materia4: req.session.subject4_name, materia5: req.session.subject5_name, materia6: req.session.subject6_name, materia7: req.session.subject7_name, materia8: req.session.subject8_name, materia9: req.session.subject9_name, materia10: req.session.subject10_name});
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

module.exports = router;