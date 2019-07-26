DROP DATABASE nsm;
CREATE DATABASE nsm;
USE nsm;
CREATE TABLE node_tree (
    idNode int8 NOT NULL AUTO_INCREMENT,
    level int2 NOT NULL,
    iLeft int8 NOT NULL,
    iRight int8 NOT NULL, 
    PRIMARY KEY(idNode),
    KEY (idNode)
);

INSERT INTO node_tree VALUES (1,2,2,3);
INSERT INTO node_tree VALUES (2,2,4,5);
INSERT INTO node_tree VALUES (3,2,6,7);
INSERT INTO node_tree VALUES (4,2,8,9);
INSERT INTO node_tree VALUES (5,1,1,24);
INSERT INTO node_tree VALUES (6,2,10,11);
INSERT INTO node_tree VALUES (7,2,12,19);
INSERT INTO node_tree VALUES (8,3,15,16);
INSERT INTO node_tree VALUES (9,3,17,18);
INSERT INTO node_tree VALUES (10,2,20,21);
INSERT INTO node_tree VALUES (11,3,13,14);
INSERT INTO node_tree VALUES (12,2,22,23);


CREATE TABLE node_tree_names (
    idNode int8 NOT NULL AUTO_INCREMENT,
    language varchar(50) NOT NULL,
    nodeName varchar(50) NOT NULL,
    PRIMARY KEY(idNode),
    KEY (idNode)
);

INSERT INTO node_tree_names VALUE (1, 'english', 'Marketing');
INSERT INTO node_tree_names VALUE (2, 'english', 'Helpdesk');
INSERT INTO node_tree_names VALUE (3, 'english', 'Managers');
INSERT INTO node_tree_names VALUE (4, 'english', 'Customer Account');
INSERT INTO node_tree_names VALUE (5, 'english', 'Docebo');
INSERT INTO node_tree_names VALUE (6, 'english', 'Accounting');
INSERT INTO node_tree_names VALUE (7, 'english', 'Sales');
INSERT INTO node_tree_names VALUE (8, 'english', 'Italy');
INSERT INTO node_tree_names VALUE (9, 'english', 'Europe');
INSERT INTO node_tree_names VALUE (10, 'english', 'Developers');
INSERT INTO node_tree_names VALUE (11, 'english', 'North America');
INSERT INTO node_tree_names VALUE (12, 'english', 'Quality Assurance');
INSERT INTO node_tree_names VALUE (1, 'italian', 'Marketing');
INSERT INTO node_tree_names VALUE (2, 'italian', 'Supporto tecnico');
INSERT INTO node_tree_names VALUE (3, 'italian', 'Managers');
INSERT INTO node_tree_names VALUE (4, 'italian', 'Assistenza Cliente');
INSERT INTO node_tree_names VALUE (5, 'italian', 'Docebo');
INSERT INTO node_tree_names VALUE (6, 'italian', 'Amministrazione');
INSERT INTO node_tree_names VALUE (7, 'italian', 'Supporto Vendite');
INSERT INTO node_tree_names VALUE (8, 'italian', 'Italia');
INSERT INTO node_tree_names VALUE (9, 'italian', 'Europa');
INSERT INTO node_tree_names VALUE (10, 'italian', 'Sviluppatori');
INSERT INTO node_tree_names VALUE (11, 'italian', 'Nord America');
INSERT INTO node_tree_names VALUE (12, 'italian', 'Controllo Qualità');

