class HcodeFileReader{
    constructor(inputEl, imgEl){
        this._inputEl = inputEl
        this._imgEl = imgEl

        this.initInputEvent()
    }

    initInputEvent(){
        document.querySelector(this._inputEl).addEventListener("change", e=>{
            this.reader(e.target.files[0]).then(result=>{
                document.querySelector(this._imgEl).src = result
            })
        })
    }

    reader(file){
        return new Promise((s, f)=>{
            let reader = new FileReader()

            reader.onload = e=>{
                s(reader.result)
            }
    
            reader.onerror = e=>{
                f("Não foi possível ler a imagem")
            }
            
            reader.readAsDataURL(file)
        })     
    }
}