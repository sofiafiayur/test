"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
// import {Languages} from './models';
const env_json_1 = __importDefault(require("./env.json"));
// import {connection} from './connection';
// tslint:disable-next-line: no-require-imports
// const mysqlModel = require('mysql-model');
const connection = mysql_1.default.createConnection({
    host: env_json_1.default.host,
    port: env_json_1.default.port,
    user: env_json_1.default.user,
    password: env_json_1.default.password,
    database: env_json_1.default.database,
});
connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('connected');
    }
});
let mysqlRow; //  rows from table 'node_tree_names'
const invalMessage = 'Invalid node id';
const errMessage = 'There is an error!';
const missingMandtory = 'Missing mandatory params';
/**
 *  Create a new Express Class
 */
const app = express_1.default();
/**
 * define the url without node_id or language as params inputs
 * return missingMandoty
 */
exports.noParamsAppGet = app.get('/:node_id?', (req, res, next) => {
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
exports.ParamsAppGet = app.get('/:node_id/:language', (req, res, next) => {
    let node_id = req.params.node_id;
    let language = req.params.language;
    let search = req.query.search;
    let page_num = req.query.page_num || 0;
    let page_size = req.query.page_size || 100;
    let page_start = page_size * page_num;
    let limit = page_start + ', ' + page_size;
    try {
        if (page_num > 0) {
            res.send('Invalid page number requested');
            next();
        }
        else if (page_size < 0 || page_size > 1000) {
            res.send('Invalid page size requested');
            next();
        }
        else {
            if (language && node_id) {
                // get the row from table 'node_tree' with idNode = node_id inserted
                let sqlNode_Tree = 'SELECT * FROM node_tree WHERE idNode = ? ';
                connection.query(sqlNode_Tree, [node_id], (err, rows) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        throw new Error(errMessage);
                    }
                    if (rows && rows.length > 0) {
                        const node_treeRow = yield rows;
                        // get iLeft and iRight of the selected row, and query children from table 'node_tree' with the 2 data inputs.
                        node_treeRow.forEach((row) => {
                            const p_iLeft = row.iLeft;
                            const p_iRight = row.iRight;
                            connection.query('SELECT * FROM node_tree WHERE iLeft > ? AND iRight < ?', [p_iLeft, p_iRight], (error, children) => __awaiter(this, void 0, void 0, function* () {
                                if (error) {
                                    throw new Error(errMessage);
                                }
                                // get the length of children
                                let child_num = yield children.length;
                                if (search && search.length > 0) {
                                    let sql = 'SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? AND nodeName LIKE ? LIMIT ' + limit;
                                    let queryParams = [node_id, language, '%' + search + '%'];
                                    mysqlQuery(sql, queryParams)
                                        .then((myRows) => {
                                        if (myRows) {
                                            let resRow = {
                                                node_id: myRows[0].idNode,
                                                name: myRows[0].nodeName,
                                                children_count: child_num,
                                            };
                                            res.send(resRow);
                                        }
                                        else {
                                            res.send(invalMessage);
                                        }
                                    })
                                        .catch((errs) => { throw new Error(errMessage); });
                                }
                                else {
                                    let sql = 'SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? LIMIT ' + limit;
                                    let queryParams = [node_id, language];
                                    mysqlQuery(sql, queryParams)
                                        .then((myRows) => {
                                        if (myRows) {
                                            let resRow = {
                                                node_id: myRows[0].idNode,
                                                name: myRows[0].nodeName,
                                                children_count: child_num,
                                            };
                                            res.send(resRow);
                                        }
                                        else {
                                            res.send(invalMessage);
                                        }
                                    })
                                        .catch((errs) => { throw new Error(errMessage); });
                                }
                            }));
                        });
                    }
                }));
            }
            else {
                res.send(missingMandtory);
            }
        }
    }
    catch (_a) {
        res.status(500).send(errMessage);
    }
});
/**
 * Get rows from table 'node_tree_names'
 * @param sql
 * @param queryParams
 */
function mysqlQuery(sql, queryParams) {
    return new Promise((resolve, rejects) => {
        connection.query(sql, queryParams, (err, rows) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                resolve(errMessage);
                // throw new Error(errMessage);
            }
            else {
                if (rows && rows.length > 0) {
                    resolve(rows);
                }
                else {
                    resolve(invalMessage);
                }
            }
        }));
    });
}
exports.mysqlQuery = mysqlQuery;
/**
 * open local port 3000...
 */
app.listen(3000, () => console.log('Example app listening on port 3000...'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE4QjtBQUM5QixrREFBMEI7QUFDMUIsc0NBQXNDO0FBQ3RDLDBEQUE2QjtBQUM3QiwyQ0FBMkM7QUFDM0MsK0NBQStDO0FBQy9DLDZDQUE2QztBQUU3QyxNQUFNLFVBQVUsR0FBRyxlQUFLLENBQUMsZ0JBQWdCLENBQUM7SUFDdEMsSUFBSSxFQUFFLGtCQUFHLENBQUMsSUFBSTtJQUNkLElBQUksRUFBRSxrQkFBRyxDQUFDLElBQUk7SUFDZCxJQUFJLEVBQUUsa0JBQUcsQ0FBQyxJQUFJO0lBQ2QsUUFBUSxFQUFFLGtCQUFHLENBQUMsUUFBUTtJQUN0QixRQUFRLEVBQUUsa0JBQUcsQ0FBQyxRQUFRO0NBQ3pCLENBQUMsQ0FBQztBQUVILFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFHO0lBQzNCLElBQUksR0FBRyxFQUFFO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNwQjtTQUFNO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUM1QjtBQUNMLENBQUMsQ0FBQyxDQUFDO0FBR0gsSUFBSSxRQUFlLENBQUMsQ0FBSSxxQ0FBcUM7QUFDN0QsTUFBTSxZQUFZLEdBQVcsaUJBQWlCLENBQUM7QUFDL0MsTUFBTSxVQUFVLEdBQVcsb0JBQW9CLENBQUM7QUFDaEQsTUFBTSxlQUFlLEdBQVcsMEJBQTBCLENBQUM7QUFFM0Q7O0dBRUc7QUFDSCxNQUFNLEdBQUcsR0FBRyxpQkFBTyxFQUFFLENBQUM7QUFFdEI7OztHQUdHO0FBQ1UsUUFBQSxjQUFjLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQ25FLEdBQUcsQ0FBQyxJQUFJLENBQUMs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