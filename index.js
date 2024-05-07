const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const _ = require('lodash');
const chalk = require('chalk');
const listaPacientes = [];


app.listen(3000, () =>
{
    console.log("Servidor avilitado en el puerto 3000");
});

//configurar motor de vistas
app.set("view engine", "handlebars");
app.engine("handlebars", exphbs.engine());

//Importacion Bootstrap
app.use("/bootstrap", express.static(__dirname+'/node_modules/bootstrap/dist'));
app.use("/popper", express.static(__dirname+'/node_modules/@popperjs/core/dist/umd'));


app.get("/crear", (req, res) =>
{
    const url = "https://randomuser.me/api/";

    //usando axios
    axios
    .get(url)
    .then(response =>
    {
        let nombre = response.data.results[0].name.first;
        let apellido = response.data.results[0].name.last;
        let sexo = response.data.results[0].gender;
        let fecha_registro = response.data.results[0].registered.date;

        //usando moment
        fecha_registro = moment(fecha_registro).format("DD/MM/YYYY HH:MM");


        if(sexo == "male")
        {
            sexo = "masculino";
        }
        else
        {
            sexo = "femenino";
        }

        res.render("crear",
        {
            nombre : nombre,
            apellido : apellido,
            sexo : sexo,
            registro : fecha_registro
        });
    })
    .catch(err =>
    {
        res.send("error al cargar la data");
    })
})

app.get("/crearPaciente", (req, res) =>
{
    const {txtNombre, txtApellido, txtSexo, txtRegistro} = req.query;

    //usando uuid
    let idPaciente = uuidv4();
    const objPaciente = {id:idPaciente, nombre:txtNombre, apellido:txtApellido, sexo:txtSexo, fecha_registro:txtRegistro};
    
    if(listaPacientes.push(objPaciente))
    {
        res.redirect("/");
    }
})


app.get("/", (req, res) =>
{
    //usando lodash
    var result = _.chain(listaPacientes)
    .groupBy("sexo")
    .value();

    let Masculino = result['masculino'];
    let Femenino = result['femenino'];

    let arr = JSON.stringify(listaPacientes);

    //usando chalk
    console.log(chalk.blue.bgWhite(arr));

    res.render("ver",
    {
        arrPacientes : listaPacientes,
        arrFemenino : Femenino,
        arrMasculino : Masculino
    });
})