let conn = require("./db")
const Pagination = require("./Pagination")
var moment = require("moment")

module.exports = {

    getReservations(req){
        return new Promise((s, f) =>{
            if(!req.query.page){
                req.query.page = 1
            }
            
            let page = req.query.page
            let dtstart = req.query.start
            let dtend = req.query.end

            
    
            let params = []
    
            if(dtstart && dtend) params.push(dtstart, dtend)
    
            let pag = new Pagination(`SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations ${(dtstart && dtend) ? `WHERE date BETWEEN ? AND ?` : ``} ORDER BY name LIMIT ?, ?`, params)
    
            pag.getPage(page).then(data=>{
                s({
                    data,
                    links: pag.getNavegation(req.query)
                })
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
      },

    chart(req){
        return new Promise((s,f) =>{
            conn.query(`
            SELECT CONCAT(YEAR(date), '-', MONTH(date)) AS date, COUNT(*) AS total, SUM(people) / COUNT(*) AS avg_people
            FROM tb_reservations
            WHERE date BETWEEN ? AND ?
            GROUP BY YEAR(date), MONTH(date)
            ORDER BY YEAR(date), MONTH(date)
        `,  [
                req.query.start,
                req.query.end
            ], (err, result)=>{
                if(err){
                    f(err)
                }else{
                    let months = []
                    let values = []

                    result.forEach(row => {
                        months.push(moment(row.date).format("MMM YYYY"))
                        values.push(row.total)
                    });

                    s({
                        months,
                        values
                    })
                }
            })
        })
    },

    dashboard(){
        return new Promise((s, f)=>{
            conn.query(`SELECT
            (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
            (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
            (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
            (SELECT COUNT(*) FROM tb_users) AS nrusers;`, (err, result)=>{
                if(err){
                    f(err)
                }else{
                    s(result[0])
                }
            })
        })
        
    }
}