import express from 'express';
import mysql from 'mysql';
import {Languages} from './models';

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

// const appModel = mysqlModel.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: '1234',
//     database: 'nsm',
// });

// const node_tree = appModel.extend({
//     tabletableName: 'node_tree',
// });

// const node_tree_names = appModel.extend({
//     tabletableName: 'node_tree_names',
// });

// let node_treeItem = new node_tree();
// let node_tree_name = new node_tree_names();


// app.get('/:node_id?', (req, res, next) => {
//     res.send('Missing mandatory params');
//     next();
// });

// let node_treeList: any = {};
// connection.query('SELECT * FROM node_tree WHERE idNode = ?', (err, rows: any[]) => {
//     if (err) throw err;
//     console.log('Data received from Db:\n');
//     rows.forEach((row: any, i: number) => {
//         console.log('row', row);
//         node_treeList = Object.assign(node_treeList, row);
//         node_treeList[(i + 1)] = row;
//     });
//     // node_treeList = JSON.parse(JSON.stringify(rows));
//     console.log(node_treeList);
// });

app.get('/:node_id/:language', (req, res, next) => {
    let node_id = req.params.node_id;
    let language = req.params.language;
    let search = req.query.search;
    let page_num = req.query.page_num ? req.query.page_num : 0;
    let page_size = req.query.page_size ? req.query.page_size : 100;
    let page_start = page_size * page_num;
    let limit = page_start + ', ' + page_size;
    if (language && node_id) {
        let sqlNode_Tree = 'SELECT * FROM node_tree WHERE idNode = ? ';
        connection.query(sqlNode_Tree, [node_id], async (err, rows) => {
            console.log('reqrows', rows);
            if (rows && rows.length > 0) {
                const node_treeRow = await rows;
                node_treeRow.forEach((row: any) => {
                    const p_iLeft = row.iLeft;
                    const p_iRight = row.iRight;
                    console.log('p_iLeft', p_iLeft, 'p_iRight', p_iRight);
                    connection.query('SELECT * FROM node_tree WHERE iLeft > ? AND iRight < ?', [p_iLeft, p_iRight],
                    async (err, children) => {
                        console.log('children', children);
                        if (children && children.length > 0) {
                            let child_num = await children.length;
                            console.log('child_num', child_num, children.length);

                            if (search) {
                                let sql = 'SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? AND nodeName LIKE ? LIMIT ' + limit;
                                connection.query(sql, [node_id, language, '%' + search + '%'],
                                        async (err, rows: any) => {
                                            // console.log('req', req.params, 'node_id', node_id, 'language',
                                            // language, 'rows', rows, req.query, 'page_num', page_num, 'page_size', page_size, sql);
                                            if (rows && rows.length > 0) {
                                                let resRows = await {
                                                    node_id: rows[0].idNode,
                                                    name: rows[0].nodeName,
                                                    children_count: child_num,
                                                };
                                                console.log(resRows);
                                                res.send(resRows);
                                            } else {
                                                res.send('Invalid node id');
                                            }
                                            if (err) { res.send(err); }
                                        });
                                        // searchKeyWords(node_id, language, search);
                                        // res.send();
                                        // console.log('node_id', node_id, 'language', language, req.query);
                    
                            } else {
                                let sql = 'SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? LIMIT ' + limit;
                                connection.query(sql, [node_id, language], (err, rows: any) => {
                                    console.log('req', req.params, 'page_size', page_size, 'language', language, 'rows', rows, sql);
                                    if (rows && rows.length > 0) {
                                        console.log(rows)
                                        res.send(rows);
                                    } else {
                                        res.send('Invalid node id');
                                    }
                                    if (err) { res.send(err); }
                                });
                            }
                        }
                    })
                });
            }
        });
        
    } else {
        res.send('Missing mandatory params');
    }


})


// app.get('/:node_id/:language/:search?', (req, res, next) => {
//     let node_id = req.params.node_id;
//     let language = req.params.language;
//     let search = req.params.search;
//     if (!language) {
//         res.send('Missing mandatory params');
//     }
//     let sql = 'SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? AND nodeName LIKE ?';
//     connection.query(sql, [node_id, language, '%' + search + '%'], (err, rows: any) => {
//         console.log('req', req.params, 'search');
//         if (rows && rows.length > 0) {
//             console.log(rows)
//             res.send(rows);
//         } else {
//             res.send('Invalid node id');
//         }
//     });
// })

app.get('/:node_id/:language/:search/:page_size?', (req, res, next) => {
    let node_id = req.params.node_id;
    let language = req.params.language;
    let search = req.params.search;
    let page_size = req.params.page_size;
    if (!language) {
        res.send('Missing mandatory params');
    }
    let sql = 'SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? AND nodeName LIKE ? LIMIT ?';
    connection.query(sql, [node_id, language, '%' + search + '%', page_size], (err, rows: any) => {
        console.log('req', req.params, 'page_size', page_size, 'language', language, 'rows', rows);
        if (rows && rows.length > 0) {
            console.log(rows)
            res.send(rows);
        } else {
            res.send('Invalid node id');
        }
    });
})

app.get('/:node_id/:language/:search/:page_num/:page_size?', (req, res, next) => {
    let node_id = req.params.node_id;
    let language = req.params.language;
    let search = req.params.search;
    let page_size = req.params.page_size;
    let page_num = req.params.page_num;
    let page_start = page_size * page_num;
    
    let sql = 'SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? AND nodeName LIKE ? LIMIT ? ,?';
    connection.query(sql, [node_id, language, '%' + search + '%', page_start, page_size], (err, rows: any) => {
        console.log('req', req.params, 'page_start', page_start);
        if (rows && rows.length > 0) {
            console.log(rows)
            res.send(rows);
        } else {
            res.send('Invalid node id');
        }
    });
})

// function searchKeyWords (node_id: any, language: Languages, key: string): any  {
//     let sql = 'SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? AND nodeName LIKE ?';
//     const results = connection.query(sql, [node_id, language, '%' + key + '%'],
//     (err, rows: any) => {
//         console.log('rows', rows);
//         if (rows && rows.length > 0) {
//             console.log(rows)
//             return rows;
//         } else {
//             return 'Invalid node id';
//         }
//     });
// }


app.listen(3000, () => console.log('Example app listening on port 3000!'));
