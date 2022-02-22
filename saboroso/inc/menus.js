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
    }
}