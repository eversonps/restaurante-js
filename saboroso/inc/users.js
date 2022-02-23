const { resolveInclude } = require("ejs")
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
    }
}