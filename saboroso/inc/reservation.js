let conn = require("./db")

module.exports = {

    getReservations(){
        return new Promise((s, f)=>{
            conn.query("SELECT * FROM tb_reservations ORDER BY id", (err, result)=>{
                if(err){
                  f(err)
                }else{
                  console.log(result)
                  s(result)
                }
            })
        })
    },

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

        if(fields.date.indexOf("/") > -1){
            fields.date = fields.date.split('/').reverse().join('-');
        }
        

        let query, params = [
            fields.name,
            fields.email,
            fields.people,
            fields.date,
            fields.time
        ]

        if(parseInt(fields.id) > 0){
            query = "UPDATE tb_reservations SET name = ?, email = ?, people = ?, date = ?, time = ? WHERE id = ?"
            params.push(fields.id)
        }else{
            query = "INSERT INTO tb_reservations (name, email, people, date, time) VALUES (?, ?, ?, ?, ?)"
        }

        return new Promise((s,f)=>{
            conn.query(query, params, (err, result)=>{
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
          conn.query("DELETE FROM tb_reservations WHERE id = ?", [
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