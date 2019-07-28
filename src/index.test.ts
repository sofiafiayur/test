
import {noParamsAppGet, ParamsAppGet, mysqlQuery} from './index';

describe('mysqlQuery', () => {
    it('should return rows', () => {
        expect(() => {
            mysqlQuery('SELECT * FROM node_tree_names WHERE idNode = ? AND language = ? AND nodeName LIKE ? LIMIT 1, 100 ', [5, 'english', 'o'])
                .then((rows: any) => {
                    rows = [ { idNode: 5, language: 'english', nodeName: 'Docebo' } ];
                });
        });
    });
});
