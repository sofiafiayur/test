import express from 'express';
import mysql from 'mysql';
// import {Languages} from './models';
import env from './env.json';
// import {connection} from './connection';
// tslint:disable-next-line: no-require-imports
// const mysqlModel = require('mysql-model');

const connection = mysql.createConnection({
    host: env.host,
    port: env.port,
    user: env.user,
    password: env.password,
    database: env.database,
});

connection.connect(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('connected');
    }
});
export type Languages = 'english' | 'italian';

let mysqlRow: any[];    //  rows from table 'node_tree_names'
const invalMessage: String = 'Invalid node id';
const errMessage: string = 'There is an error!';
const missingMandtory: string = 'Missing mandatory params';

/**
 *  Create a new Express Class
 */
const app = express();

/**
 * define the url without node_id or language as params inputs
 * return missingMandoty
 */
export const noParamsAppGet = app.get('/:node_id?', (req, res, next) => {
    res.send(missingMandtory);
    next();
});

/**
 * define the url with both of node_id and language as params inputs
 * return resRow {
 *          node_id: number,
 *          nodeName: string,
 *          child_num: number,
 *        }
 */
export const ParamsAppGet = app.get('/:node_id/:language', (req, res, next) => {
    let node_id: Number = req.params.node_id;
    let language: Languages = req.params.language;
    let search = req.query.search;
    let page_num = req.query.page_num || 0;
    let page_size = req.query.page_size || 100;
    let page_start = page_size * page_num;
    let limit = page_start + ', ' + page_size;
    try {
        if (page_num > 0) {
            res.send('Invalid page number requested');
            next();
        } else if (page_size < 0 || page_size > 1000) {
            res.send('Invalid page size requested');
            next();
        } else {
            if (language && node_id) {
                // get the row from table 'node_tree' with idNode = node_id inserted
                let sqlNode_Tree = 'SELECT * FROM node_tree WHERE idNode = ? ';
                connection.query(sqlNode_Tree, [node_id], async (err: any, rows: any[]) => {
                    if (err) {
                        throw new Error(errMessage);
                    }
                    if (rows && rows.length > 0) {
                        const node_treeRow = await rows;
                        // get iLeft and iRight of the selected row, and query children from table 'node_tree' with the 2 data inputs.
                        node_treeRow.forEach((row: any) => {
                            const p_iLeft = row.iLeft;
                            const p_iRight = row.iRight;
                            connection.query('SELECT * FROM node_tree WHERE iLeft > ? AND iRight < ?', [p_iLeft, p_iRight],
                                async (error: any, children: any[]) => {
                                    if (error) {
                                        throw new Error(errMessage);
                                    }
                                    // get the length of children
                                    let child_num = await children.length;
                                    if (search && search.length > 0) {
                                        let sql = 'SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? AND nodeName LIKE ? LIMIT ' + limit;
                                        let queryParams = [node_id, language, '%' + search + '%'];
                                        mysqlQuery(sql, queryParams)
                                            .then((myRows: any) => {
                                                if (myRows) {
                                                    let resRow = {
                                                        node_id: myRows[0].idNode,
                                                        name: myRows[0].nodeName,
                                                        children_count: child_num,
                                                    };
                                                    res.send(resRow);
                                                } else {
                                                    res.send(invalMessage);
                                                }
                                             })
                                            .catch((errs) => { throw new Error(errMessage); });
                                    } else {
                                        let sql = 'SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? LIMIT ' + limit;
                                        let queryParams = [node_id, language];
                                        mysqlQuery(sql, queryParams)
                                            .then((myRows: any) => {
                                                if (myRows) {
                                                    let resRow = {
                                                        node_id: myRows[0].idNode,
                                                        name: myRows[0].nodeName,
                                                        children_count: child_num,
                                                    };
                                                    res.send(resRow);
                                                } else {
                                                    res.send(invalMessage);
                                                }
                                            })
                                            .catch((errs) => { throw new Error(errMessage); });
                                }
                            });
                        });
                    }
                });
            } else {
                res.send(missingMandtory);
            }
        }
    } catch {
        res.status(500).send(errMessage);
    }
});

/**
 * Get rows from table 'node_tree_names'
 * @param sql
 * @param queryParams
 */
export function mysqlQuery (sql: string, queryParams: any[])  {
    return new Promise ((resolve, rejects) => {
        connection.query(sql, queryParams,
            async (err: any, rows: any) => {
                if (err) {
                    resolve(errMessage);
                    // throw new Error(errMessage);
                } else {
                    if (rows && rows.length > 0) {
                        resolve(rows);
                    } else {
                        resolve(invalMessage);
                    }
                }
        });
    });

}

/**
 * open local port 3000...
 */
app.listen(3000, () => console.log('Example app listening on port 3000...'));
