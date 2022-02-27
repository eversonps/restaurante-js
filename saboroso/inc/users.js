const req = require("express/lib/request")
var conn = require("./db")

module.exports = {
    render(req, res, error){
        res.render("admin/login", {
            body: req.body,
            error
        })
    },

    login(email, password){
        return new Promise((s, f)=>{
            conn.query(`SELECT * FROM tb_users WHERE email = ?`,[
                email
            ], (err, result) => {
                if(err){
                    f(err)
                }else{
                    if(!result.length > 0){
                        f("Usuário ou senha incorretos.")
                    }else{
                        let row = result[0]

                        if(row.password !== password){
                            f("Usuário ou senha incorretos.")
                        }else{
                            s(row)
                        }
                    }
                }
            })
        })
    },

    getUsers(){
        return new Promise((s, f)=>{
            conn.query("SELECT * FROM tb_users ORDER BY id", (err, result)=>{
                if(err){
                  f(err)
                }else{
                  console.log(result)
                  s(result)
                }
            })
        })
    },
  
    save(fields){
      return new Promise((s, f)=>{
        if(!fields.email || !fields.name){
          f("Usuário não cadastrado. Preencha todos os campos")
        }else{
          let query, params = [
            fields.name,
            fields.email
          ]
    
          
  
          if(parseInt(fields.id) > 0){
            params.push(fields.id)
            query = `UPDATE tb_users SET name = ?, email = ? WHERE id = ?`
          }else{
              if(!fields.password){
                f("Usuário não cadastrado. Preencha todos os campos")
              }
              params.push(fields.password)
              query = "INSERT INTO tb_users(name, email, password) VALUES (?, ?, ?)"
          }
          
          conn.query(query, params, (err, result)=>{
            if(err){
              f(err)
            }else{
              s(result)
            }
          })
        }
        
      })
    },
  
    delete(id){
      console.log("id ", id)
      return new Promise((s, f)=>{
        conn.query("DELETE FROM tb_users WHERE id = ?", [
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
    },

    changePassword(req){
      return new Promise((s, f)=>{
        if(!req.fields.password){
          f("Preencha a senha")
        }else if(!req.fields.passwordConfirm){
          f("Confirme a senha")
        }else if(req.fields.passwordConfirm != req.fields.password){
          f("As senhas não estão iguais. Confirme a senha corretamente!")
        }else{
          conn.query("UPDATE tb_users SET password = ? WHERE id = ?", [
            req.fields.password,
            req.fields.id
          ], (err, result) =>{
            if(err){
              f(err.message)
            }else{
              s(result)
            }
          })
        }
      })
    }
}