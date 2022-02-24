var conn = require("./db")

module.exports = {
    getMenus(){
        return new Promise((s, f)=>{
            conn.query("SELECT * FROM tb_menus ORDER BY title", (err, result)=>{
                if(err){
                  f(err)
                }else{
                  console.log(result)
                  s(result)
                }
            })
        })
    },

    save(fields, files){
      return new Promise((s, f)=>{
        let query, queryPhoto = "", params = [
          fields.title,
          fields.description,
          fields.price
        ]

        if(files.photo.name){
          queryPhoto = ", photo = ?"
          params.push(`images/${files.photo.name}`)
        }

        if(parseInt(fields.id) > 0){
          params.push(fields.id)
          query = `UPDATE tb_menus SET title = ?, description = ?, price = ? ${queryPhoto} WHERE id = ?`
        }else{
          if(!files.photo.name){
            f("Envie a foto do prato.")
          }

          query = "INSERT INTO tb_menus(title, description, price, photo) VALUES (?, ?, ?, ?)"
        }
        
        conn.query(query, params, (err, result)=>{
          if(err){
            f(err)
          }else{
            s(result)
          }
        })
      })
    }
}