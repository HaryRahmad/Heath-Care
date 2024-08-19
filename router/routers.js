const express = require('express')
const Controller = require('../Controller/controller')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const upload = multer({storage:storage})
const router = express()


router.get("/",Controller.landingpage)

router.get("/tes",Controller.tes)


router.get("/register",Controller.registeras)

router.get("/register/patient",Controller.getregisterpage)
router.post("/register/patient",Controller.postregisterpage)

router.get("/register/doctor",Controller.getregisterpagedoctor)
router.post("/register/doctor",Controller.postregisterpagedoctor)

router.get("/login",Controller.getloginpage)
router.post("/login",Controller.postlogin)

router.get("/logout",Controller.logout)



const user = function(req, res, next) {
    console.log('Time:', Date.now())
    // console.log(req.session)
    if (req.session.patientid) {
        next()
    }
    else{
        let err = "login first"
        res.redirect(`/login?err=${err}`)
    }
}



const doctor = function(req, res, next) {
    console.log('Time:', Date.now())
    console.log(req.session)
    if (req.session.doctorid && req.session.role) {
        next()
    }
    else{
        let err = "login first"
        res.redirect(`/login?err=${err}`)
    }
}


router.get("/doctor",doctor,Controller.pageDoctor)
router.post("/doctor",doctor, Controller.postSaran)


router.get("/doctor/addArticle",doctor, Controller.formAddArticle)
router.post("/doctor/addArticle",doctor, Controller.postAddArticle)

router.get("/doctor",doctor,Controller.pageDoctor)
router.post("/doctor",doctor, Controller.postSaran)

router.get("/doctor/addArticle",doctor, Controller.formAddArticle)
router.post("/doctor/addArticle",doctor, Controller.postAddArticle)

router.get("/doctor/myArticle",doctor, Controller.showMyArticle)

router.get("/doctor/profileEdit", doctor,Controller.showEditProfile)
router.post("/doctor/profileEdit",doctor, Controller.postEditProfile)

router.get("/user",user, Controller.landingUser)

router.get("/user/history",user, Controller.showHistory)

router.get("/doctor/article/edit/:id",doctor, Controller.formEditArticle)
router.post("/doctor/article/edit/:id",doctor, Controller.postEditArticle)

router.get("/doctor/article/delete/:id",doctor, Controller.deleteArticle)
router.post("/user/role",user,Controller.postAskUser)
router.get("/user/:role",user, Controller.formAskUser)




// router.get("/user")

module.exports = router


