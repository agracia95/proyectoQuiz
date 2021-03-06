var path = require('path');

// Cargar modelo ORM
var Sequelize = require('sequelize');

var url, storage;

if (!process.env.DATABASE_URL) {
	url = "sqlite:///";
	storage = "quiz.sqlite";
} else {
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize( url, { storage: storage, omitNull: true });

// Importar la definicion de la tabla de Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// sequelize.sync() Crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	return Quiz.count().then(function (c) {
		if (c === 0) {		// La tabla se inicializa si esta vacia
			return Quiz
			.bulkCreate([ { question: 'Capital de Italia', answer: 'Roma'},
						  { question: 'Capital de Portugal', answer: 'Lisboa'}
						])
			.then(function() {
			console.log('Base de datos inicializada con datos');
			});
		}
	});
}).catch(function(error) {
	console.log("Error sincronizando las tablas de la BBDD", error);
	process.exit(1);
});

exports.Quiz = Quiz;	// Exportar la definicion de la tabla Quiz