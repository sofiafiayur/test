import express from 'express';
import mysql from 'mysql';
// import env from './env.json';
// tslint:disable-next-line: no-require-imports
const mysqlModel = require('mysql-model');


const app = express();



const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'nsm',
});

connection.connect(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('connected');
    }
});

const appModel = mysqlModel.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'nsm',
});

const node_tree = appModel.extend({
    tabletableName: 'NODE_TREE',
});

const node_tree_names = appModel.extend({
    tabletableName: 'NODE_TREE_NAMES',
});

let node_treeItem = new node_tree();
let node_tree_name = new node_tree_names();

console.log('node_treeItem', node_treeItem, 'node_tree_name', node_tree_name)

connection.query('SELECT * FROM node_tree', (err, rows) => {
    if (err) throw err;
    console.log('Data received from Db:\n');
    console.log(rows);
  });



// app.listen(3000, () => console.log('Example app listening on port 3000!'));
