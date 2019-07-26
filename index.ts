import express from 'express';
import mysql from 'mysql';


const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));

const connection = mysql.createConnection({
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '1234',
    'database': 'nsm',
});

connection.connect(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('connected');
    }
});
