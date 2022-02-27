
var conn = require("./db")

module.exports = {
    render(req, res, error, success){
        res.render("contacts", {
            title: 'Contatos - Restaurante Saboroso',
            background: "images/img_bg_3.jpg",
            h1: "Diga um oi!",
            body: req.body,
            error,
            success
          })
    },

    save(fields){
        return new Promise((s, f)=>{
            conn.query("INSERT INTO tb_contacts (name, email, message) VALUES (?, ?, ?)", [
                fields.name,
                fields.email,
                fields.message
            ], (err, result)=>{
                if(err){
                    f(err)
                }else{
                    s(result)
                }
            })
        })
    },

    getContacts(){
        return new Promise((s, f)=>{
            conn.query("SELECT * FROM tb_contacts ORDER BY id", (err, result)=>{
                if(err){
                  f(err)
                }else{
                  console.log(result)
                  s(result)
                }
            })
        })
    },

    delete(id){
        console.log("id ", id)
        return new Promise((s, f)=>{
          conn.query("DELETE FROM tb_contacts WHERE id = ?", [
            id
          ], (err, result) => {
              if(err){
                f(err)
              }else{
                s(result)
              }
            }
          )
        })
      }
}