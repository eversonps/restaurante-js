var express = require('express');
const connection = require('./../inc/db');
var conn = require("./../inc/db")
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  conn.query("SELECT * FROM tb_menus ORDER BY title", (err, result)=>{
    if(err){
      console.error(err)
    }else{
      console.log(result)
      res.render("index", {
        title: 'Restaurante Saboroso',
        menus: result
      })
    }
  })
});

router.get('/contacts', function(req, res, next) {
  res.render("contacts", {
    title: 'Contatos - Restaurante Saboroso'
  })
});

router.get('/menus', function(req, res, next) {
  res.render("menus", {
    title: 'Menus - Restaurante Saboroso'
  })
});

router.get('/reservations', function(req, res, next) {
  res.render("reservations", {
    title: 'Reservas - Restaurante Saboroso'
  })
});

router.get('/services', function(req, res, next) {
  res.render("services", {
    title: 'Serviços - Restaurante Saboroso'
  })
});


module.exports = router;
