import { Router } from "express";
import UserManager from "../DAO/managers/usersManager.js";
import { createHash, isValidPass  } from "../../utils.js";
import passport from "passport";
import  initializePassport  from "../config/passport.config.js";
import userModel from "../DAO/models/users.model.js";






const route= Router()
const manager = new UserManager()
initializePassport()









passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser(async(id, done)=>{
    let user= await userModel.findById(id);
    done(null, user)
})




// register/create new user ////////////////////////////////////////////////


route.get("/register", ( req, res)=>{
    res.render("register")
})



route.post("/api/sessions/register", passport.authenticate("register",{failureRedirect:"/failRegister"}), async(req, res)=>{
    res.send({status: "success", message:"usuario registrado"})
})

route.get("/failRegister", async(req, res)=>{
    console.log(`falla en el registro`)
    res.send({error:"fallo el registro"})
})


/// login 

route.get("/api/sessions/login", (req, res)=>{
    res.render("login")
})


route.post("/api/sessions/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "credencial invalida" })


    const user= req.user;//llamo al objeto devuelto en el done() en la estrategia register 
    req.session.user=user;//y lo asigno a la session 
    
    //res.send({ status: "success", payload: req.user, cookie: req.session.cookie})
    res.redirect("/products")
})


route.get("/faillogin", (req, res)=>{
    res.send("algo fallo")
})





//login with github
route.get("/api/sessions/github", passport.authenticate("github",{scope:["user:email"]}), async(req, res)=>{})

// callback
route.get("/api/sessions/githubcallback",  passport.authenticate("github", {failureRedirect:"/register"})  , async(req, res)=>{
    req.session.user=req.user;
    res.redirect("/products")
})


route.get("/api/sessions/current", (req, res)=>{
    res.send({currentUser:req.session.user})
})



///view user cart

route.get("api/sessions/userCart", async(req, res)=>{

})



route.get("/logout", (req, res)=>{
    req.session.destroy(err=>{
        if(!err)res.redirect("/api/sessions/login")
        else res.send({status:`logout error`, body: err})
    })

})

export default route;
