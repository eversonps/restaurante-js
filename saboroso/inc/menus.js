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
        conn.query("INSERT INTO tb_menus(title, description, price, photo) VALUES (?, ?, ?, ?)", [
          fields.title,
          fields.description,
          fields.price,
          `images/${files.photo.name}`
        ], (err, result)=>{
          if(err){
            f(err)
          }else{
            s(result)
          }
        })
      })
    }
}