const express = require("express");
const Cloudant = require ("@cloudant/cloudant");
const router_class = require("./routes_class");
const clases_middleware = require("./middlewares/clases");
const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({extended: true}));

router.get("/",(req,res)=>{
    if(req.session.user_type == "alumno"){
        res.render("app/index_al",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode});
    }else if(req.session.user_type == "maestro"){
        res.render("app/index_mt",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode});
    }
});
router.get("/myuser",(req,res)=>{
    res.render("app/myuser",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode, usertype: req.session.user_type});
});

router.get("/crear_clase",(req,res)=>{
    if(req.session.user_type == "alumno"){
        res.redirect("/app");
    }else if(req.session.user_type == "maestro"){
        res.render("app/nueva_clase");
}
});

router.post("/nueva_clase",(req,res)=>{
    do{
        var rn1 = Math.random();
        rn1 = Math.round(rn1*10);
        var rn2 = Math.random();
        rn2 = Math.round(rn2*10);
        var rn3 = Math.random();
        rn3 = Math.round(rn3*10);
        var rn4 = Math.random();
        rn4 = Math.round(rn4*10);
        var rn5 = Math.random();
        rn5 = Math.round(rn5*10);
    }while(rn1 === 10 || rn2 === 10 || rn3 === 10 || rn4 === 10 || rn5 === 10 || rn1 === 0 || rn2 === 0 || rn3 === 0 || rn4 === 0 || rn5 === 0);
    classcode = ""+rn1+rn2+rn3+rn4+rn5+"";
    cloudant();
    async function cloudant(){
        try{
            console.log("Creando Conexion con la Base de Datos.....");
            const cloudant = Cloudant({
                url: "https://9f54e758-3ad6-4391-8439-003d07506891-bluemix.cloudantnosqldb.appdomain.cloud",
                plugins: {
                    iamauth:{
                        iamApiKey: "BXXfOZYJWpnnPykjZcJSJ8pOtuuADMw9M_mrxZ0IRum0"
                    }
                }
            });
            console.log("Conexion con Base de Datos creada");
            const piku_users = cloudant.db.use("piku_clases");
            new_class = await piku_users.insert({"_id":classcode,
                "classname":req.body.classname,
                "description":req.body.description,
                "grade" :req.body.grade,
                "group": req.body.group,
                "turn": req.body.turn,
                "school":req.body.school
            });
            console.log("Documento Creado en piku_clases");
            res.send("Nueva clase");
        }catch(err){
            console.error(err);
            do{
                var rn1 = Math.random();
                rn1 = Math.round(rn1*10);
                var rn2 = Math.random();
                rn2 = Math.round(rn2*10);
                var rn3 = Math.random();
                rn3 = Math.round(rn3*10);
                var rn4 = Math.random();
                rn4 = Math.round(rn4*10);
                var rn5 = Math.random();
                rn5 = Math.round(rn5*10);
            }while(rn1 === 10 || rn2 === 10 || rn3 === 10 || rn4 === 10 || rn5 === 10 || rn1 === 0 || rn2 === 0 || rn3 === 0 || rn4 === 0 || rn5 === 0);
            classcode = ""+rn1+rn2+rn3+rn4+rn5+"";  
            
            cloudant();
            async function cloudant(){
                try{
                    console.log("Creando Conexion con la Base de Datos.....");
                    const cloudant = Cloudant({
                        url: "https://9f54e758-3ad6-4391-8439-003d07506891-bluemix.cloudantnosqldb.appdomain.cloud",
                        plugins: {
                            iamauth:{
                                iamApiKey: "BXXfOZYJWpnnPykjZcJSJ8pOtuuADMw9M_mrxZ0IRum0"
                            }
                        }
                    });
                    console.log("Conexion con Base de Datos creada");
                    const piku_users = cloudant.db.use("piku_clases");
                    new_class = await piku_users.insert({"_id":classcode,
                        "classname":req.body.classname,
                        "description":req.body.description,
                        "grade" :req.body.grade,
                        "group": req.body.group,
                        "turn": req.body.turn,
                        "school":req.body.school
                    });
                    console.log("Documento Creado en piku_clases");
                    res.send("Nueva clase");
                }catch(err){
                    console.error(err);
                    res.send("Ha ocurrdo un error, intenta de nuevo por favor");
                }
            }
        }
    }
});

router.use("/clase", clases_middleware);
router.use("/clase", router_class);

module.exports = router;
