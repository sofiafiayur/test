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


CREATE TABLE node_tree_names (
	idName int8 NOT NULL AUTO_INCREMENT,
    idNode int8 NOT NULL,
    language varchar(50) NOT NULL,
    nodeName varchar(50) NOT NULL,
    PRIMARY KEY(idName),
    KEY (idName)
);


