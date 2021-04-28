var express = require("express");
const Cloudant = require ("@cloudant/cloudant");
var app = express();

app.use("/public",express.static("public"));

app.use(express.json()); //Peticiones con formato application/json
app.use(express.urlencoded({extended: true}));

app.set("view engine","pug");
const PORT = 3000;

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/login_al",(req,res)=>{
    res.render("login");    
});

app.post("/users",(req,res)=>{

    //---------------------------------------- Crear DB ----------------------------------------//

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

        var JSON_al = {
            "user_type": "alumn",
            "name": req.body.name,
            "lastname": req.body.lastname,
            "email": req.body.email,
            "birthday": req.body.birthday,
            "pikoins": 0,
            "class_code": null
        }
            const db = cloudant.db.use("piku_alumn");
            let res="";
            doc_al = JSON_al;
            res = db.insert(doc_al);
            console.log("Agregando DB");
        }catch(err){
            console.log(err);
        }
    }

    //-----------------------------------------------------------------------------------------//


    console.log("Nombre: " + req.body.name);
    console.log("Apellido: " + req.body.lastname);
    console.log("Correo o Numero: " + req.body.email);
    console.log("Fecha de Nacimiento: " + req.body.birthday);
    res.render("users");
});

app.listen(PORT,()=>{
    console.log("La app Piku ha iniciado en el puerto: " + PORT)
});
