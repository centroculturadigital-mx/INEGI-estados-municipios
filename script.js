function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

const fetch = require("cross-fetch")

let estadosMunicipios = {}

let municipios



const obtenerMunicipios = () => {
        

    try {


        
        municipios = new Array(3).fill("").map((e,i)=>{
            return `https://gaia.inegi.org.mx/wscatgeo/mgem/${pad(i+1)}`
        })
        .map((u,i)=>new Promise((resolve,reject)=>{

            try {
                resolve(
                    fetch(u)
                    // .then(r =>  r.json().then(data => ({ u, status: r.status, body: data})))
                    .then(r =>  r.json().then(data => estadosMunicipios[i+1]=data.datos.map(d=>d.nom_agem)))
                )
            } catch(err) {
                reject(err)
            }
                        
        }))



    } catch(err) {
        console.log(err)
    }






    Promise.all(municipios).then(m=>{
        municipios = m
        console.log("estadosMunicipios", estadosMunicipios)
    }).catch(console.log)



}

const obtenerEstados = () => {



    let estados = new Array(3).fill("").map((e,i)=>{
        return `https://gaia.inegi.org.mx/wscatgeo/mgee/${pad(i+1)}`
    }).map((u,i)=>new Promise((resolve,reject)=>{

        try {
            resolve(
                fetch(u)
                // .then(r =>  r.json().then(data => ({ u, status: r.status, body: data})))
                .then(r =>  r.json().then(({datos}) => ({
                    nombre: datos.nom_agee,
                    clave: datos.nom_abrev,
                    municipios: []
                })))
            )
        } catch(err) {
            reject(err)
        }
                    
    }))


    Promise.all(estados).then(es=>{
        estados = es
        console.log("estados", estados)
    }).catch(console.log)

}



obtenerEstados()