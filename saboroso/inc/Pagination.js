const { TIS620_BIN } = require("mysql2/lib/constants/charsets")
let conn = require("./db")

class Pagination{
    constructor(query, params = [], itemsPerPage = 10){
        this.query = query
        this.params = params
        this.itemsPerPage = itemsPerPage
        this.currentPage = 1
    }

    getPage(page){
        this.currentPage = page - 1
        this.params.push(
            this.currentPage * this.itemsPerPage,
            this.itemsPerPage
        )
        return new Promise((s, f) =>{
            conn.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), this.params, (err, result) => {
                if(err){
                    f(err)
                }else{
                    this.data = result[0]
                    this.total = result[1][0].FOUND_ROWS
                    this.totalPages = Math.ceil(this.total / this.itemsPerPage)
                    this.currentPage++
                    s(this.data)
                }
            })
        })
    }

    getTotal(){
        return this.total
    }

    getTotalPages(){
        return this.totalPages
    }


    getCurrentPage(){
        return this.currentPage
    }

    getNavegation(params){
        let limitsPagesNav = 5
        let links = []
        let nrstart = 0
        let nrend = 0

        if(this.getTotalPages() < limitsPagesNav){
            limitsPagesNav = this.getTotalPages()
        }

        if(this.getCurrentPage() - parseInt((limitsPagesNav/2)) < 1){
            nrstart = 1
            nrend = limitsPagesNav
        }else if(this.getCurrentPage() + parseInt((limitsPagesNav / 2)) > this.getTotalPages()){
            nrstart = this.getTotalPages() - limitsPagesNav + 1
            nrend = this.getTotalPages()   
        }else{
            nrstart = this.getCurrentPage() - parseInt(limitsPagesNav/2)
            nrend = this.getCurrentPage() + parseInt(limitsPagesNav/2)
        }

        if(this.getCurrentPage() > 1){
            links.push({
                text: "<<",
                href: "?" + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage()-1}))
            })
        }

        for(let x = nrstart; x <=nrend; x++){
            links.push({
                text: x,
                href: "?" + this.getQueryString(Object.assign({}, params, {page: x})),
                active: (x === this.getCurrentPage())
            })
        }

        if(this.getCurrentPage() < this.getTotalPages()){
            links.push({
                text: ">>",
                href: "?" + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage()+1}))
            })
        }

        return links
    }

    getQueryString(params){
        let queryString = []

        for(let name in params){
            queryString.push(`${name}=${params[name]}`)
        }

        return queryString.join("&")
    }
}

module.exports = Pagination