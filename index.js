const http = require('http');
const express = require("express");
const app = express();
const md5 = require('md5');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const SECRET = 'thomastools'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/*
app.post('/login',(req, res) => {

const connection = require('./database').connect();
    
    connection.connect((error) => {
        if (error){
            res.json({error : true}); 
            console.error(error);
            return;
        }})

        cpfdouser = req.body.cpf;


        const idusuario = "select users.idusers FROM malwee.users where cpf =" + cpfdouser





    if(){
    const token = jwt.sign({iduser:1}, SECRET, {expiresIn: 300})
    return res.json({ auth: true, token});
    }
    res.status(401).end();
})*/

const execSQL = (sql) => {
    return new Promise((resolve, reject) => {
        const connection = require('./database').connect();
    
        connection.connect((error) => {
            if (error){
                reject(error);
                return;
            }
                   
            connection.query(sql, (error, result) => {
                if (error){
                    reject(error);
                    return;
                }
    
                connection.destroy();
                resolve(result);
            })
        })
    })
}

app.post('/login', async (req, res) => {
    const cpf  = req.body.cpf;
    const pass = md5(req.body.password);

    const sql = `select * from users where users.cpf = '${cpf}' and password = '${pass}' and status = 1`;

    const result = await execSQL(sql);


    if (result == undefined || result.length == 0){
        res.status(401);
        res.end();
        return;
    }

    const token = jwt.sign({iduser: result[0].iduser}, SECRET, {expiresIn: 300})
    return res.json({ auth: true, token});
})

app.post('/user', async (req, res) => {
    const connection = require('./database').connect();
    
    connection.connect((error) => {
        if (error){
            res.json({error : true}); 
            console.error(error);
            return;
        }

        const password = md5(req.body.password);
       
        const sql = "insert into malwee.users( name, cpf, status, password) VALUES ("+          
        "'" + req.body.name +"', '" +
        req.body.cpf + "', " +
        req.body.status+",'" +
        password +"');";        
               
        connection.query(sql, (error) => {
            if (error){
                res.json({error : true});
                console.log(error);
                return;
            }

            connection.destroy();
            res.json({ok : true});
        })
    })
    
})



app.get('/user', function (req, res) {
    const connection = require('./database').connect();

    connection.connect((err) => {
        if (err) throw err;
        console.log('Database connected!');

        connection.query("SELECT * FROM malwee.users", (err, result) => {
            if (!err) {
                res.json(result);
            } else {
                res.json({error : true});
            }

            connection.destroy();
        })
    })
});

app.listen(3000, () => {
    console.log('App Listening on port 3000');
});