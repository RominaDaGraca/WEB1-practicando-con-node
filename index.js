const express = require('express')
const path =require('path');
var mysql=require("mysql");
var bodyparser=require("body-parser");
const fs=require('fs');
const app = express()
const port = 3000

//sirviendo archivos estaticos
app.use(express.static('public'))

app.use(bodyparser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
let options={
    root:path.join(__dirname)
}
//CONECCION A LA BASE DE DATOS
var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'biblioteca'
});
conn.connect();
conn.query("select * from libros",(err,results, fields)=>{
    let filas="";
    for(let index=0; index< results.length; index ++){
        const element = results[index];
        filas+=`<tr>
        <td>${element.idlibro}</td>
        <td>${element.codigo}</td>
        <td>${element.titulo}</td>
        <td>${element.genero}</td>
        </tr>`;

    }
    try{
        const data=fs.readFileSync('./views/index.html', 'utf-8');
        let contenido=data.replace("##libros_row", filas);
        res.send (contenido);
    }catch(err){
        console.log(err);
        res.send('Error 404')
    }
})

  //res.sendFile("/views/index.html",options);
})


app.post("/",(req,res)=>{
    var conn=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'biblioteca'
    });
    conn.connect();
    var libro={
        'codigo':req.body.codigo,
        'titulo':req.body.titulo,
        'genero':req.body.genero
    }
    var sql=`insert into libros set ?`;
    conn.query(sql,libro,(err,result,field)=>{
        if(err){
            console.log(err);
            res.send("Error conectando a la bbdd");
        }
        console.log(result)
        res.redirect("/");
        conn.end();
    })
     

    
})


app.get("/libros",(req,res)=>{
    var conn=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'biblioteca'
    });
    conn.connect();
    conn.query("select * from libros",(err,results, fields)=>{
        let filas="";
        for(let index=0; index< results.length; index ++){
            const element = results[index];
            filas+=`<tr><td>${element.codigo}</td>
            <td>${element.titulo}</td>
            <td>${element.genero}</td>
            </tr>`;

        }

        let tabla=`<table>
        <thead>
            <th>codigo</th>
            <th>titulo</th>
            <th>genero</th>
        </thead>
        <tbody>
            <tr>
               ${filas}
            </tr>
        </tbody>
    </table>` ;
        console.log(err);
        console.log(results);
        res.send(tabla);
    })

})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})