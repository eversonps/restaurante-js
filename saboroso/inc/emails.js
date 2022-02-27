
const req = require("express/lib/request")
var conn = require("./db")

module.exports = {
    save(fields){
      console.log(fields)
        return new Promise((s, f)=>{
          if(!fields.email){
            f("preencha o email")
          }else{
            conn.query("INSERT INTO tb_emails (email) VALUES (?)", [
              fields.email
          ], (err, result)=>{
              if(err){
                  f(err)
              }else{
                  s(result)
              }
          })
          }       
        })
    },

    getEmails(){
        return new Promise((s, f)=>{
            conn.query("SELECT * FROM tb_emails ORDER BY id", (err, result)=>{
                if(err){
                  f(err)
                }else{
                  s(result)
                }
            })
        })
    },

    delete(id){
        return new Promise((s, f)=>{
          conn.query("DELETE FROM tb_emails WHERE id = ?", [
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