function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

const fetch = require("cross-fetch")

const API_URL_ESTADOS = "https://gaia.inegi.org.mx/wscatgeo/mgem"
const API_URL_MUNICIPIOS = "https://gaia.inegi.org.mx/wscatgeo/mgee"


const obtenerMunicipios = (estados) => {
        

    try {
        
        let municipios = estados.map((estado,i)=>{
            return {
                estado,
                url: `${API_URL_ESTADOS}/${pad(i+1)}`
            }
        })
        .map(({
            estado,
            url
        })=>new Promise((resolve,reject)=>{

            try {
                resolve(
                    fetch(url)
                    // .then(r =>  r.json().then(data => ({ u, status: r.status, body: data})))
                    .then(r =>  r.json().then(data => {
                        estado.municipios = data.datos.map(d=>d.nom_agem)
                    })
                ))
            } catch(err) {
                reject(err)
            }
                        
        }))


        Promise.all(municipios).then(m=>{
            municipios = m
            console.log("estados", estados)
        }).catch(console.log)


    } catch(err) {
        console.log(err)
    }


}

const obtenerEstados = () => {



    let estados = new Array(32).fill("").map((e,i)=>{
        return `${API_URL_MUNICIPIOS}/${pad(i+1)}`
    }).map((u,i)=>new Promise((resolve,reject)=>{

        try {
            resolve(
                fetch(u)            
                .then(r =>  r.json().then(({datos}) => ({
                    nombre: datos.nom_agee,
                    clave: datos.nom_abrev.toUpperCase().replace(".",""),
                    municipios: []
                })))
            )
        } catch(err) {
            reject(err)
        }
                    
    }))


    Promise.all(estados).then(es=>{

        estados = es

        obtenerMunicipios( estados )

    }).catch(console.log)

}



obtenerEstados()

