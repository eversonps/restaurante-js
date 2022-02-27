var express = require("express")
var router = express.Router()
var users = require("./../inc/users")
var admin = require("./../inc/admin")
var menus = require("./../inc/menus")
var contacts = require("./../inc/contacts")
var emails = require("./../inc/emails")
var reservations = require("./../inc/reservation")
var moment = require("moment")
moment.locale("pt-BR")

router.use((req, res, next)=>{
    if(["/login"].indexOf(req.url) == -1 && !req.session.user){
        res.redirect("/admin/login")
    }else{
        next()
    }
})

router.use((req, res, next)=>{
    req.menus = admin.getMenus(req)
    next()
})

router.get("/logout", (req, res, next)=>{
    delete req.session.user
    res.redirect("/admin/login")
})

router.get("/", function(req, res, next){
    admin.dashboard().then(data=>{
        res.render("admin/index", admin.getParams(req, {
            data
        }))
    }).catch(err=>{
        console.error(err)
    })
})

router.post("/login", function(req, res, next){
    if(!req.body.email){
        users.render(req, res, "Preencha o campo email")
    }else if(!req.body.password){
        users.render(req, res, "Preencha o campo senha")
    }else{
        users.login(req.body.email, req.body.password).then(user=>{
            console.log(user)
            req.session.user = user
            res.redirect("/admin")
        }).catch(err=>{
            users.render(req, res, err.message || err)
        })
    }
})

router.get("/login", function(req, res, next){
    users.render(req, res, null)
})

router.get("/contacts", function(req, res, next){
    contacts.getContacts().then(data=>{
        res.render("admin/contacts", admin.getParams(req, {
            data
        }))
    })
})

router.post("/contacts", function(req, res, next){
    contacts.getContacts().then(data=>{
        res.render("admin/contacts", admin.getParams(req, {
            data
        }))
    })
})

router.delete("/contacts/:id", function(req, res, next){
    contacts.delete(req.params.id).then(results=>{
        res.send(results)
    }).catch(e=>{
        res.send({
            error: e
        })
    })
})

router.get("/emails", function(req, res, next){
    emails.getEmails().then(data=>{
        res.render("admin/emails", admin.getParams(req, {
            data
        }))
    })
})

router.delete("/emails/:id", function(req, res, next){
    emails.delete(req.params.id).then(results=>{
        res.send(results)
    }).catch(e=>{
        res.send({
            error: e
        })
    })
})

router.get("/menus", function(req, res, next){
    menus.getMenus().then(data=>{
        res.render("admin/menus", admin.getParams(req, {
            data
        }))
    }).catch(err=>{
        console.error(err)
    })
})

router.post("/menus", function(req, res, next){
    menus.save(req.fields, req.files).then(result=>{
        res.send(result)
    }).catch(e=>{
        res.send({
            error: e
        })
    })
})

router.delete("/menus/:id", function(req, res, next){
    menus.delete(req.params.id).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send({
            error: err
        })
    })
})


router.get("/reservations", function(req, res, next){
    let start = (req.query.start) ? req.query.start : moment().subtract(5, 'year').format("YYYY-MM-DD")
    let end = (req.query.end) ? req.query.end : moment().format("YYYY-MM-DD")

    reservations.getReservations(req).then(pag=>{
        res.render("admin/reservations", admin.getParams(req, { date: {
            start,
            end
        }, 
         data: pag.data,
         moment,
         links: pag.links
        }))
    })
})

router.post("/reservations", function(req, res, next){
    reservations.save(req.fields, req.files).then(result=>{
        res.send(result)
    }).catch(e=>{
        res.send({
            error: e
        })
    })
})

router.delete("/reservations/:id", function(req, res, next){
    reservations.delete(req.params.id).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send({
            error: err
        })
    })
})


router.get("/users", function(req, res, next){
    users.getUsers().then(data=>{
        res.render("admin/users", admin.getParams(req, {
            data
        }))
    })
})

router.post("/users", function(req, res, next){
    users.save(req.fields).then(result=>{
        res.send(result)
    }).catch(err=>{
        console.log(err)
        res.send({
            error: err
        })
    })
})

router.post("/users/password-change", function(req, res, next){
    console.log("req", req)
    users.changePassword(req).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send({
            error: err
        })
    })
})

router.delete("/users/:id", function(req, res, next){
    users.delete(req.params.id).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send({
            error: err
        })
    })

})

module.exports = router