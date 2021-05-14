const express = require("express");
const Cloudant = require ("@cloudant/cloudant");
const router_class = require("./routes_class");
const clases_middleware = require("./middlewares/clases");
const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({extended: true}));

//-------------------- /App --------------------
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
            r5 = await db.get(req.session.user_classcode);
            
            if(req.session.user_type == "alumno"){
                res.render("app/index_al",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode, classname: r5.classname, grade: r5.grade, group: r5.group, school: r5.school, avatar: req.session.user_avatar});
            }else if(req.session.user_type == "maestro"){
                res.render("app/index_mt",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode, classname: r5.classname, grade: r5.grade, group: r5.group, school: r5.school, avatar: req.session.user_avatar});
            }
        }catch(err){
            if(req.session.user_classcode == null){ 
                if(req.session.user_type == "alumno"){
                    res.render("app/index_al",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode, avatar: req.session.user_avatar});
                }else if(req.session.user_type == "maestro"){
                    res.render("app/index_mt",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode, avatar: req.session.user_avatar});
                }
            }else if(req.session.user_classcode !== null){
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
            }
        } 
    }
});

//-------------------- My User --------------------
router.get("/myuser",(req,res)=>{
    res.render("app/myuser",{name: req.session.user_name, lastname: req.session.user_lastname, email: req.session.user_id, birthday: req.session.user_birthday, pikoins: req.session.user_pikoins, classcode: req.session.user_classcode, usertype: req.session.user_type});
});

//-------------------- Crear una clase formulario --------------------
router.get("/crear_clase",(req,res)=>{
    if(req.session.user_type == "alumno"){
        res.redirect("/app");
    }else if(req.session.user_type == "maestro"){
        if(req.session.user_classcode == null){
            res.render("app/nueva_clase");
        }else if(req.session.user_classcode !== null){
            res.redirect("/app");
        }
        
}
});

//-------------------- Crear clase en DB --------------------
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
    cloudant_cl();
    async function cloudant_cl(){
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
                "created_by":req.session.user_name+" "+req.session.user_lastname,
                "grade" :req.body.grade,
                "group": req.body.group,
                "turn": req.body.turn,
                "school":req.body.school,
                "subject1":{
                    "subject_name": req.body.subject1
                },
                "subject2":{
                    "subject_name": req.body.subject2
                },
                "subject3":{
                    "subject_name": req.body.subject3
                },
                "subject4":{
                    "subject_name": req.body.subject4
                },
                "subject5":{
                    "subject_name": req.body.subject5
                },
                "subject6":{
                    "subject_name": req.body.subject6
                },
                "subject7":{
                    "subject_name": req.body.subject7
                },
                "subject8":{
                    "subject_name": req.body.subject8
                },
                "subject9":{
                    "subject_name": req.body.subject9
                },
                "subject10":{
                    "subject_name": req.body.subject10
                }
            });
            console.log("Documento Creado en piku_clases");
            cloudant_cle();
                async function cloudant_cle(){
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
                
                        doc_ed = r;
                        doc_ed["_rev"]=r._rev
                        doc_ed.classcode = classcode;
                        r = await db.insert(doc_ed);
                        console.log("Documento editado")
                        
                        res.redirect("/app")
                    }catch(err){
                        console.log(err);
                        res.send("Ha ocurrdo un error, intenta de nuevo por favor");
                    }
            }
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
            
            cloudant_cl();
            async function cloudant_cl(){
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
                        "created_by":req.session.user_name+" "+req.session.user_lastname,
                        "grade" :req.body.grade,
                        "group": req.body.group,
                        "turn": req.body.turn,
                        "school":req.body.school,
                        "subject1":{
                            "subject_name": req.body.subject1
                        },
                        "subject2":{
                            "subject_name": req.body.subject2
                        },
                        "subject3":{
                            "subject_name": req.body.subject3
                        },
                        "subject4":{
                            "subject_name": req.body.subject4
                        },
                        "subject5":{
                            "subject_name": req.body.subject5
                        },
                        "subject6":{
                            "subject_name": req.body.subject6
                        },
                        "subject7":{
                            "subject_name": req.body.subject7
                        },
                        "subject8":{
                            "subject_name": req.body.subject8
                        },
                        "subject9":{
                            "subject_name": req.body.subject9
                        },
                        "subject10":{
                            "subject_name": req.body.subject10
                        }
                    });
                    console.log("Documento Creado en piku_clases");
                    res.send("Nueva clase");
                        cloudant_cle();
                        async function cloudant_cle(){
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
                                doc_ed.classcode = classcode;
                                r = await db.insert(doc_ed);
                                console.log("Documento editado")

                                res.redirect("/app")
                            }catch(err){
                                console.log(err);
                                res.send("Ha ocurrdo un error, intenta de nuevo por favor");
                            }
                    }
                }catch(err){
                    console.error(err);
                    res.send("Ha ocurrdo un error, intenta de nuevo por favor");
                }
            }
        }
    }
});

//-------------------- Entrar a clase --------------------
router.post("/entrar_clase",(req,res)=>{
    cloudant_rc();
    async function cloudant_rc(){
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
            r3 = await db.get(req.body.cod);
            console.log(r3);
            
            cloudant_ac();
            async function cloudant_ac(){
                try{
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
                    r2 = await db.get(req.session.user_id);
                    console.log(res);

                    doc_ed = r2;
                    doc_ed["_rev"]=r2._rev
                    doc_ed.classcode = req.body.cod;
                    r2 = await db.insert(doc_ed);
                    console.log("Documento editado: ")
                    console.log(r2);
                    res.redirect("/app/clase");
                }catch(err){
                    console.log("Error: " + err);
                    res.send("Ha ocurrido un error");
                }
            }
        }catch(err){
            console.log(err);
            res.send("Esa clase no existe")
        } 
    }
});

//------------------- Editar info de user -------------------
router.get("/edit_user",(req,res)=>{
    res.render("app/edit_user",{name: req.session.user_name, lastname: req.session.user_lastname, birthday: req.session.user_birthday, usertype: req.session.user_type});
});

//------------------- Editando info en DB -------------------
router.post("/user_edited",(req,res)=>{
    if(req.session.user_type == "alumno"){
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
                const db = cloudant.db.use("piku_users");
                let user="";
                user= await db.get(req.session.user_id);
                console.log("DB Obtenida");
                doc_ed = user;

                doc_ed["_rev"]=user._rev
                if(req.body.nname == ""){
                    doc_ed.name = req.session.user_name;
                }else if(req.body.nname !== ""){
                    doc_ed.name = req.body.nname;
                }
                if(req.body.nlastname == ""){
                    doc_ed.lastname = req.session.user_lastname;
                }else if(req.body.nlastname !== ""){
                    doc_ed.lastname = req.body.nlastname;
                }
                if(req.body.nbirthday == ""){
                    doc_ed.birthday = req.session.user_birthday;
                }else if(req.body.nbirthday !== ""){
                    doc_ed.birthday = req.body.nbirthday;
                }

                user = await db.insert(doc_ed);
                console.log("Documento editado: ")
                console.log(user);

                res.redirect("/app/myuser");
            }catch(err){
                console.log(err);
                res.redirect("/app");
            }
        }
    }else if(req.session.user_type == "maestro"){
        if(req.body.password !== req.session.user_password){
            res.render("app/edit_user",{name: req.session.user_name, lastname: req.session.user_lastname, birthday: req.session.user_birthday, usertype: req.session.user_type, error: "La contraseña es incorrecta"})
        }else if(req.body.password == req.session.user_password){
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
                    const db = cloudant.db.use("piku_users");
                    let user="";
                    user= await db.get(req.session.user_id);
                    console.log("DB Obtenida");
                    doc_ed = user;

                    doc_ed["_rev"]=user._rev
                    if(req.body.nname == ""){
                        doc_ed.name = req.session.user_name;
                    }else if(req.body.nname !== ""){
                        doc_ed.name = req.body.nname;
                    }
                    if(req.body.nlastname == ""){
                        doc_ed.lastname = req.session.user_lastname;
                    }else if(req.body.nlastname !== ""){
                        doc_ed.lastname = req.body.nlastname;
                    }
                    if(req.body.nbirthday == ""){
                        doc_ed.birthday = req.session.user_birthday;
                    }else if(req.body.nbirthday !== ""){
                        doc_ed.birthday = req.body.nbirthday;
                    }

                    user = await db.insert(doc_ed);
                    console.log("Documento editado: ")
                    console.log(user);

                    res.redirect("/app/myuser");
                }catch(err){
                    console.log(err);
                    res.redirect("/app");
                }
            }
        }
    }
});

//-------------------- Eliminar DB de clase--------------------
router.get("/delete_clase",(req,res)=>{
    if(req.session.user_type == "maestro"){
        cloudant_dc();
        async function cloudant_dc(){
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
                r1 = await db.destroy(req.session.class_id, req.session.class_rev);
                console.log(r1);
                console.log("Documento eliminado");
                    
                res.redirect("/app");
            }catch(err){
                console.log(err);
                res.redirect("/app");
            } 
        }
    }else if(req.session.user_type == "alumno"){
        res.redirect("/app");
    }
});

//---------------- Ver Avatar --------------------------------
router.get("/avatar",(req,res)=>{
    res.render("app/avatar",{avatar: req.session.user_avatar});
});

//------------------- Actualizar Avatar ---------------------
router.get("/act_avatar/:avatar",(req,res)=>{
    ava = req.url.split("/")
    ava = ava[2].split("?");
    ava = ava[0]
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

            const db = cloudant.db.use("piku_users");
            console.log("Obteniendo documento de las Base de datos");
            x = await db.get(req.session.user_id);
            console.log(x);

            doc_ed = x;
            doc_ed["_rev"]=x._rev
            doc_ed.avatar = ava;
            x = await db.insert(doc_ed);
            console.log("Documento editado: ")
            console.log(x);     

            res.redirect("/app");
        }catch(err){
            console.log(err);
            res.redirect("/app");
        }
    }
});

router.use("/clase", clases_middleware);
router.use("/clase", router_class);

module.exports = router;


            