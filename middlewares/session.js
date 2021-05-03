module.exports = (req,res,next)=>{
    if(!req.session.user_id){
        res.redirect("/");
    }else if(req.session.user_id){
        next();
    }
}