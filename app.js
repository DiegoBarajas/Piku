const express = require("express");
const Cloudant = require ("@cloudant/cloudant");
const session = require("express-session");
const app = express();
const PORT = 8080;

app.use("/public",express.static("public"));

app.use(express.json()); //Peticiones con formato application/json
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: "d3e8b20v04k12g6we8megdf4",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine","pug");


//------------------------- INDEX -------------------------\\
app.get("/",(req,res)=>{
    res.render("index");
});


//------------------------- INICIAR SESION -------------------------\\
app.get("/login_al",(req,res)=>{
    res.render("login_al");
});

app.get("/login_mt",(req,res)=>{
    res.render("login_mt");
});

//------------------------- CREAR CUENTA -------------------------\\
app.get("/signup_al",(req,res)=>{
    res.render("signup_al");
});

app.get("/signup_mt",(req,res)=>{
    res.render("signup_mt");
});


//------------------------- NUEVO USUARIO -------------------------\\
app.post("/new_user",(req,res)=>{
    //Se compara que las contraseñas existen si no es alumno
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

                const piku_users = cloudant.db.use("piku_alumn");
                new_user = await piku_users.insert({"_id":req.body.email,
                    "usertype": "alumno",
                    "name":req.body.name,
                    "lastname":req.body.lastname,
                    "email" :req.body.email,
                    "birthday": req.body.birthday,
                    "classcode":null, 
                    "pikoins":0
                });
                console.log("Documento Creado en piku_alumn");

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

                const piku_users = cloudant.db.use("piku_mtrs");
                new_user = await piku_users.insert({"_id":req.body.email,
                    "usertype": "maestro",
                    "name":req.body.name,
                    "lastname":req.body.lastname,
                    "email" :req.body.email,
                    "password":req.body.password,
                    "birthday": req.body.birthday,
                    "classcode":null, 
                    "pikoins":0
                });
                console.log("Documento Creado en piku_mtrs");

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
                const db = cloudant.db.use("piku_alumn");
                let user="";
                user= await db.get(req.body.email);
                console.log("DB Obtenida");
                console.log(user);
                req.session.user_id = user._id

                console.log(req.session.user_id);
            res.render("user_al",{name: user.name});
            }catch(err){
                console.log(err);
                res.render("user_un");
            }
        }

});

//------------------------- USUARIO MAESTRO-------------------------\\
app.post("/user_mt",(req,res)=>{

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
                const db = cloudant.db.use("piku_mtrs");
                let user="";
                user= await db.get(req.body.email);
                console.log("DB Obtenida");
                console.log(user);
                if(req.body.password == user.password){
                    req.session.user_id = user._id
                    res.render("user_mt",{name: user.name});
                    
                    console.log(req.session.user_id);
                }else if(req.body.password !== user.password){
                    res.render("wrong_pass");
                }
            }catch(err){
                console.log(err);
                res.render("user_un");
            }
        }

});
app.listen(PORT,()=>{
    console.log("La app Piku ha iniciado en el puerto: " + PORT)
});
