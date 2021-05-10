module.exports = (req,res,next)=>{
    if(!req.session.user_id){
        res.redirect("/");
    }else if(req.session.user_id){
        const Cloudant = require ("@cloudant/cloudant");

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
                user= await db.get(req.session.user_id);
                console.log("DB Obtenida");
                console.log(user);
                    req.session.user_id = user._id;
                    req.session.user_name = user.name;
                    req.session.user_lastname = user.lastname;
                    req.session.user_birthday = user.birthday;
                    req.session.user_classcode = user.classcode;
                    req.session.user_pikoins = user.pikoins;
                    req.session.user_password = user.password;
                next();
            }catch(err){
                console.log(err);
            }
        }
    }
}