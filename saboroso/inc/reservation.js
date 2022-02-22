let conn = require("./db")

module.exports = {
    render(req, res, error, success){
        res.render("reservations", {
            title: 'Reservas - Restaurante Saboroso',
            background: "images/img_bg_2.jpg",
            h1: "Reserve uma Mesa!",
            body: req.body,
            error,
            success
        })
    },

    save(fields){
        fields.date = fields.date.split('/').reverse().join('-');

        return new Promise((s,f)=>{
            conn.query("INSERT INTO tb_reservations (name, email, people, date, time) VALUES (?, ?, ?, ?, ?)", [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
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