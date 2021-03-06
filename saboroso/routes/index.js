var express = require('express');
const connection = require('./../inc/db');
var conn = require("./../inc/db")
var menus = require("./../inc/menus")
var reservations = require("./../inc/reservation")
var contacts = require("./../inc/contacts")
var emails = require("./../inc/emails")

var router = express.Router();

/* GET home page. */

module.exports = function(io){
  router.get('/', function(req, res, next) {
    menus.getMenus().then(result=>{
      res.render("index", {
        title: 'Restaurante Saboroso',
        menus: result,
        isHome: true
      })
    }).catch(e=>{
      console.log(e)
    })
  });
  
  router.post('/contacts', function(req, res, next) {
    if(!req.body.name){
      contacts.render(req, res, "Digite o nome")
    }else if(!req.body.email){
      contacts.render(req, res, "Digite o email")
    }else if(!req.body.message){
      contacts.render(req, res, "Digite uma mensagem")
    }else{
      contacts.save(req.body).then(result=>{
        req.body = {}
        io.emit("dashboard update")
        contacts.render(req, res, null, "Reserva realizada com sucesso!")
      }).catch(e=>{
        contacts.render(req, res, e.message)
      })
    }
  });
  
  router.get('/contacts', function(req, res, next) {
    contacts.render(req, res)
  });
  
  router.get('/menus', function(req, res, next) {
    menus.getMenus().then(result=>{
      console.log(result)
      res.render("menus", {
        title: 'Menus - Restaurante Saboroso',
        background: "images/img_bg_1.jpg",
        h1: "Saboreie nosso menu!",
        menus: result
      })
    }).catch(e=>{
      console.log(e)
    })
  });
  
  router.get('/reservations', function(req, res, next) {
    console.log(req.body)
    reservations.render(req, res)
  });
  
  router.post('/reservations', function(req, res, next) {
    console.log(req.body)
    if(!req.body.name){
      reservations.render(req, res, "Digite o nome")
    }else if(!req.body.email){
      reservations.render(req, res, "Digite o email")
    }else if(!req.body.people){
      reservations.render(req, res, "Selecione o n??mero de pessoas")
    }else if(!req.body.date){
      reservations.render(req, res, "Selecione a data")
    }else if(!req.body.time){
      reservations.render(req, res, "Selecione a hora")
    }else{
      reservations.save(req.body).then(result=>{
        req.body = {}
        io.emit("dashboard update")
        reservations.render(req, res, null, "Reserva realizada com sucesso!")
      }).catch(e=>{
        reservations.render(req, res, e.message)
      })
    }
  });
  
  router.get('/services', function(req, res, next) {
    res.render("services", {
      title: 'Servi??os - Restaurante Saboroso',
      background: "images/img_bg_1.jpg",
      h1: "?? um prazer poder servir!"
    })
  });
  
  router.post("/subscribe", function(req, res, next){
    emails.save(req.fields).then(result=>{
        res.send(result)
    }).catch(err=>{
      console.log(err)
        res.send({
          error: err
        })
    })
  })
  
  return router
};
