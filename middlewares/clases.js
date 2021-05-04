module.exports = (req,res,next)=>{
    if(!req.session.user_classcode){
        res.redirect("/app");
    }else if(req.session.user_classcode){
        next();
    }
}