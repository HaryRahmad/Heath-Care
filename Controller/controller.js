
const { where } = require("sequelize")
const {Doctor, User, Article, AskSuggestion, ProfileDoctor} = require("../models")
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize');

class Controller{
    static async landingpage(req,res){
        try {
            res.render("landingPage")
            
        } catch (error) {
            res.send(error)
        }
    }

    static tes(req,res){
        try {
            let data = "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ba/29/5c/img-worlds-of-adventure.jpg?w=1200&h=-1&s=1"
            res.render("tes",{data})

        } catch (error) {
            res.send(error)
        }
    }

    static async registeras(req,res){
        try {
            res.render("registeras")
            
        } catch (error) {
            res.send(error)
        }
    }

    static async getregisterpage(req,res){
        try {
            const { err } = req.query

            res.render("register",{err})
            
        } catch (error) {
            res.send(error)

        }
    }

    static async postregisterpage(req,res){
        try {
            // console.log(req.body)
            const {name,email,password,role} = req.body
            
            // console.log(req.file.path)
            
            await User.createuser(name,email,password,role)

            res.redirect("/login")

            
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let data = error.errors.map(r => {
                    return r.message
                 }).join(",")

                res.redirect(`/register/patient?err=${data}`)
            }
            else{
                console.log(error)
                res.send(error)
            }
        }
    }       

    static async getregisterpagedoctor(req,res){
        try {
            // let data = Doctor.findAll()
            const { err } = req.query

            res.render("register_doctor",{err})
            
        } catch (error) {
            res.send(error)
        }
    }

    static async postregisterpagedoctor(req,res){
        try {
            const {name,email,password,role} = req.body

            let data = await Doctor.create({name,role,email,password})

            await ProfileDoctor.create({DoctorId:data.id})
            res.redirect("/login")
            
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                let data = error.errors.map(r => {
                    return r.message
                 }).join(",")


                res.redirect(`/register/doctor?err=${data}`)
            }
        }
    }
    

    static async getloginpage(req,res){
        try {
            const {err}= req.query
            res.render("login",{err})
            
        } catch (error) {
            res.send(error)

        }
    }

    static async postlogin(req,res){
        try {
            //findOne dari database,check apabila doctor atau patient
            //kalau user ada check password/compare di databse
            // kalau tidak sama, ga bisa ke main home page, out error
            // kalau sama redirect main home
            //findOne sebelumnya buat kondisi untuk role user,apabila patient 
            //({where:{name:req.nody.name,role}})
            
            const {name,password,role} = req.body
            if (name === undefined) {
                let err = "incomplete input please check again"
                res.redirect(`/login?err=${err}`)
            }
            // console.log(req.body)

            if (role === "Patient") {
                let data = await User.findOne({where:{name:name}})
                let err = "username or password is wrong"
                // console.log(data)
                if (!data) {
                    res.redirect(`/login?err=${err}`)
                }
                if(data){
                    let checkvalid = bcrypt.compareSync(password,data.password)
                    if (checkvalid === true) {
                        req.session.patientid = data.id
                        
                        res.redirect("/user")

                        // res.send("login completed")
                    }else{
                        res.redirect(`/login?err=${err}`)
                    }
                }
            }
            else if(role === "Doctor"){
                let data = await Doctor.findOne({where:{name:name}})
                let err = "username or password is wrong"
                // console.log(data)
                if (!data) {
                    res.redirect(`/login?err=${err}`)
                }
                if(data){
                    let checkvalid = bcrypt.compareSync(password,data.password)
                    if (checkvalid === true) {
                        req.session.doctorid = data.id
                        req.session.role = role

                        res.redirect("/doctor")
                        // res.send("login completed")
                    }
                    else{
                        res.redirect(`/login?err=${err}`)
                    }
                }
            }
            
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async logout(req,res){
        try {
            req.session.destroy((err => {
                if(err){
                    res.redirect("/login")
                }
                else{
                    res.redirect("/login")
                }
            }))
        } catch (error) {
            res.send(error)
        }

    }


    static async pageDoctor(req, res){
        try {
            // console.log(req.user);
            // const {id} = req.user
            const {doctorid} = req.session
            let DoctorId = doctorid
            let data = await Doctor.findByPk(DoctorId,{
                include:{
                    model : AskSuggestion,
                    where :{
                        suggestion:null
                    },
                    include:{
                        model: User,
                        
                    }
                }
            })
            if (data === null) {
                data = await Doctor.findByPk(1)
            }
            // console.log(data);
            // res.send(data)
            res.render("pageDoctor",{data,title : `page Doctor`})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postSaran(req, res){
        try {
            const {suggestion, id} = req.body
            // console.log(req.body);
            await AskSuggestion.update({suggestion},
                {
                    where:{
                    id: id
                }
            }
            )
            res.redirect(`/doctor`)
        } catch (error) {
            res.send(error)
        }
    }
    static async formAddArticle(req,res){
        try {
            res.render("formAddArticle", {title:`Form Add Article`})
        } catch (error) {
            res.send(error)
        }
    }
    static async postAddArticle(req,res){
        try {

            const {doctorid} = req.session
            let DoctorId = doctorid
            // console.log(`-------------------`,req.Session);
            // console.log(`--------------------------`,doctorid);
            const {img, title, description} = req.body
            await Article.create({ title, img, description, DoctorId})
            res.redirect("/doctor/article")
        } catch (error) {
            console.log(error);
            res.send(error)

        }
    }

    static async showMyArticle(req,res){
        try {
            const {doctorid} = req.session
            let data = await Article.findAll({
                where:{
                    DoctorId:doctorid
                }
            })
            res.render("articlePersonal", {data, title:`My Article`})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    
    static async formEditArticle(req, res){
        try {
            // const {doctorid} = req.session
            const {id} = req.params
            // console.log(`-----------------------------`,id);
            let data = await Article.findByPk(id)
            // res.send(data)
            res.render("formEditArticle", {data, title:`Form Edit`})
        } catch (error) {
            res.send(error)
        }
    }

    static async postEditArticle(req,res){
        try {
            const {id} = req.params
            const {img, title, description} = req.body
            await Article.update({img, title, description},{
                where:{
                    id:id
                }
            })
            req.redirect("/doctor/myArticle")
        } catch (error) {
            res.send(error)
        }
    }
    static async deleteArticle(req,res){
        try {
            const {id} = req.params
            await Article.destroy({
                where:{
                    id:id
                }
            })
            
            res.redirect("/doctor/myArticle")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async showEditProfile(req,res){
        try {
            const {doctorid} = req.session
            let data = await Doctor.findAll({
                where:{
                    id:doctorid
                },include:{
                    model:ProfileDoctor
                }
            })
            // res.send(data)
                res.render("editProfile", {data, title:`Page Profile`})
        } catch (error) {
            res.send(error)
        }
    }
    static async postEditProfile(req, res){
        try {
            const {doctorid} = req.session
            const {name, age, description, profilePicture} = req.body
            // const filepath = req.file.path
            // console.log(filepath)
            await ProfileDoctor.update({name, age, description,profilePicture},{
                where:{
                    DoctorId:doctorid
                }
            })
            res.redirect("/doctor")
        } catch (error) {
            res.send(error)
        }
    }
    static async landingUser(req,res){
        try {
            const {search} = req.query
            // res.send(data)
            let data
            // console.log(req.query);
            if (search) {
                data = await Article.findAll({
                    where:{
                        title:{
                            [Op.iLike]: `%${search}%`
                        }
                    }                 
                })
            }else{
                data = await Article.findAll()
            }
            res.render("landingUser", {data, title:`Landing Page User`})
        } catch (error) {
            console.log(error);
            res.send(error)
        }

        // console.log(req.session);
    }
    static async formAskUser(req, res){
        try {
            const {role} = req.params
            
            // console.log(`--------------------------------`,role);
            let data1 = await Doctor.findAll({
                where:{
                    role:role
                }
            })
            let data = await ProfileDoctor.findAll({
                include:{
                    model:Doctor,
                    where:{
                        role:role
                    }
                }
            })
            // res.send(data)
            // console.log(data);
            res.render("pageAskUser", {data,data1,title:`Form Ask `})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async postAskUser(req, res){
        try {
            const {patientid} = req.session
            let UserId = patientid
            // console.log(`----------`,req.body);
            const {asking, DoctorId} = req.body
            await AskSuggestion.create({UserId, asking, DoctorId})
            res.redirect('/user')
        } catch (error) {
            res.send(error)
        }
    }
    static async showHistory(req, res){
        try {
            const {patientid} = req.session
            let data = await AskSuggestion.findAll({
                where:{
                    UserId:patientid
                },include:{
                    model:Doctor
                }
            })
            // res.send(data)
            res.render(`historyUser`, {data, title:`History User`})
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller