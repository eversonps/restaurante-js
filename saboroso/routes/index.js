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

module.exports = router;
