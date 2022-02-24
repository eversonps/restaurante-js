HTMLFormElement.prototype.save = function(){
    let form = this

    return new Promise((s, f) => {
        form.addEventListener("submit", e=>{
            console.log("entrou")
            e.preventDefault()
            let formCreateDate = new FormData(form)
            console.log(form)
        
            fetch(form.action, {
              method: form.method,
              body: formCreateDate
            }).then(response=>{
              response.json()
            }).then(json=>{
                s(json)
            }).catch(err=>{
                f(err)
            })
        })
    })
}