/*
The MIT License (MIT)

Copyright © 2021 centroculturadigital.mx

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

const fs = require("fs")
const fetch = require("cross-fetch")

const API_URL_ESTADOS = "https://gaia.inegi.org.mx/wscatgeo/mgem"
const API_URL_MUNICIPIOS = "https://gaia.inegi.org.mx/wscatgeo/mgee"


const obtenerMunicipios = (estados, accion) => {
        

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

            accion()

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

        obtenerMunicipios( estados, () => {
            
            fs.writeFileSync('./resultado.json', JSON.stringify(estados));

        })

    }).catch(console.log)

}



obtenerEstados()

