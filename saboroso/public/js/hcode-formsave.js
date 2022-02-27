HTMLFormElement.prototype.save = function(config){
    console.log(config)
    let form = this
 
    form.addEventListener("submit", e=>{
        console.log(form)
        e.preventDefault()
        let formCreateDate = new FormData(form)
        console.log(form.action)
        console.log(form.method)
    
        fetch(form.action, {
            method: form.method,
            body: formCreateDate
        })
        .then((response) => {
            return response.json()
        })
        .then(function(json){
            console.log(json)
            let erro = json.error

            if(erro){
                console.log("erro")
                if(typeof config.failure === "function") config.failure(erro)
            }else{
                if(typeof config.success === "function") config.success(json)
            }
        }).catch(err=>{
            console.log("erro")
            if(typeof config.failure === "function") config.failure(err)
        })
    })
}