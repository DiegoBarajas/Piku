const express = require("express");
const Cloudant = require ("@cloudant/cloudant");
const session = require("express-session");
const router_app = require("./routes");
const sessions_middleware = require("./middlewares/session");
const app = express();
const PORT = 8080;

app.use("/public",express.static("public"));

app.use(express.json()); //Peticiones con formato application/json
app.use(express.urlencoded({extended: true})); //Peticiones para el url
//Sessions de express
app.use(session({
    secret: "d3e8b20v04k12g6we8megdf4",
    resave: false,
    saveUninitialized: false
}));

//Decirle al codigo que esta usando PUG como motor de vistas
app.set("view engine","pug");

//------------------------------------- CODIGO -------------------------------------------
//------------------------- INDEX -------------------------\\
app.get("/",(req,res)=>{
    if(req.session.user_id){
        res.redirect("/app");
    }else if(!req.session.user_id)
    res.render("index");
});


//------------------------- INICIAR SESION -------------------------\\
//Alumnos
app.get("/login_al",(req,res)=>{
    res.render("login_al");
});
//Maestros
app.get("/login_mt",(req,res)=>{
    res.render("login_mt");
});

//------------------------- CREAR CUENTA -------------------------\\
//Alumnos
app.get("/signup_al",(req,res)=>{
    res.render("signup_al");
});
//Maestros
app.get("/signup_mt",(req,res)=>{
    res.render("signup_mt");
});

//------------------------- NUEVO USUARIO -------------------------\\
app.post("/new_user",(req,res)=>{
    //Se compara que las contraseñas existen si no, es alumno
    if (req.body.password == undefined){

        //Creando usuario en la base de datos
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

                const piku_users = cloudant.db.use("piku_users");
                new_user = await piku_users.insert({"_id":req.body.email,
                    "usertype": "alumno",
                    "name":req.body.name,
                    "lastname":req.body.lastname,
                    "email" :req.body.email,
                    "birthday": req.body.birthday,
                    "classcode":null, 
                    "avatar":"avatar_default",
                    "pikoins":0
                });
                console.log("Documento Creado en piku_users");

                res.render("new_user_al");
            }catch(err){
                console.error(err);
                res.render("id_registered");
            }
        }
    //En caso de que la contraseña exita se comparan si son igales la contraeña y la confirmacion
    }else if(req.body.password == req.body.password_c){
        //Creando usuario en la base de datos
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

                const piku_users = cloudant.db.use("piku_users");
                new_user = await piku_users.insert({"_id":req.body.email,
                    "usertype": "maestro",
                    "name":req.body.name,
                    "lastname":req.body.lastname,
                    "email" :req.body.email,
                    "password":req.body.password,
                    "birthday": req.body.birthday,
                    "classcode":null, 
                    "avatar":"avatar_default",
                    "pikoins":0
                });
                console.log("Documento Creado en piku_users");

                res.render("new_user_mt");
            }catch(err){
                console.error(err);
                res.render("id_registered");
            }
        }
    //Si no coinciden marca error
    }else if(req.body.password !== req.body.password_c){
        res.render("wrong_password")
    }
});


//------------------------- USUARIO ALUMNO-------------------------\\
app.post("/user_al",(req,res)=>{
    //Busca a el usuario en la DB
    cloudant();
    async function cloudant(){
        try {
            //Conexion con Clodant
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
            user= await db.get(req.body.email);
            console.log("DB Obtenida");
            console.log(user);
            //Asignacion de sessions
            req.session.user_id = user._id;
            req.session.user_name = user.name;
            req.session.user_lastname = user.lastname;
            req.session.user_type = user.usertype;
            req.session.user_birthday = user.birthday;
            req.session.user_classcode = user.classcode;
            req.session.user_pikoins = user.pikoins;
            req.session.user_avatar = user.avatar;
            if(user.usertype == "alumno"){
                //Al localizar el usuario si es alumno abre la app
                res.redirect("/app");
            }else if(user.usertype == "maestro"){
                //Si es maestro lo manda al regisro de maestro
                res.redirect("/login_mt");
            }
        }catch(err){
            console.log(err);
            //Si pasa error significa que el usuario no exixte
            res.render("user_un");
        }
    }
});

//------------------------- USUARIO MAESTRO-------------------------\\
app.post("/user_mt",(req,res)=>{
    //Busca al usuario y si la contraseña guardada en cloudant no coinside con la puesta en el Form manda error
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
                console.log("Obteniendo DB");
                const db = cloudant.db.use("piku_users");
                let user="";
                user= await db.get(req.body.email);
                console.log("DB Obtenida");
                console.log(user);
                if(req.body.password == user.password){
                    req.session.user_id = user._id;
                    req.session.user_name = user.name;
                    req.session.user_lastname = user.lastname;
                    req.session.user_type = user.usertype;
                    req.session.user_birthday = user.birthday;
                    req.session.user_classcode = user.classcode;
                    req.session.user_pikoins = user.pikoins;
                    req.session.user_password = user.password;
                    req.session.user_avatar = user.avatar;

                    res.redirect("/app");
                }else if(req.body.password !== user.password){
                    res.render("wrong_pass");
                }
            }catch(err){
                console.log(err);
                res.render("user_un");
            }
        }
});

//---------------- Cerrar Sesion -------------------------
app.get("/logout",(req,res)=>{
//----------User-----------
    req.session.user_id = undefined;
    req.session.user_name = undefined;
    req.session.user_lastname = undefined;
    req.session.user_birthday = undefined;
    req.session.user_classcode = undefined;
    req.session.user_pikoins = undefined;
    req.session.user_password = undefined;
    req.session.user_avatar = undefined;
    req.session.user_rev = undefined;
//----------CLass-----------
    req.session.class_id = undefined;
    req.session.class_classname = undefined;
    req.session.class_description = undefined;
    req.session.class_grade = undefined;
    req.session.class_group = undefined;
    req.session.class_turn = undefined;
    req.session.class_school = undefined;
    res.redirect("/");
});

//Middleware y el router para la app
app.use("/app",sessions_middleware);
app.use("/app",router_app);

//Lanzar el servidor
app.listen(PORT,()=>{
    console.log("La app Piku ha iniciado en el puerto: " + PORT)
});
