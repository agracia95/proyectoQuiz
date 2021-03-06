var models = require('../models');
var Sequelize = require('sequelize')

// Autoload asociado a :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId=' + quizId));
		}
	}).catch(function(error) { next (error); });
};

// GET /quizzes
exports.index = function(req, res, next) {
	models.Quiz.findAll().then(function(quizzes) {
		res.render('quizzes/index.ejs', { quizzes: quizzes });
	}).catch(function(error) { next(error) });
};

// GET /quizzes/:id
exports.show = function(req, res, next){
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		if (quiz) {
			var answer = req.query.answer || "";
			res.render('quizzes/show', { quiz: req.quiz, answer: answer });
		}
		else {
			throw new Error('No existe ese quiz en la BBDD.');
		}
	}).catch(function(error) { next(error); });
};

// GET /quizzes/:id/edit
exports.edit = function(req, res, next){
	var quiz = req.quiz;
	res.render('quizzes/edit', { quiz: quiz });
};

// GET /quizzes/:id/check
exports.check = function (req, res){
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		if (quiz) {
			var answer = req.query.answer || "";
			var result = ((answer.toLowerCase() === req.quiz.answer.toLowerCase()) ? 'Correcta' : 'Incorrecta');
			res.render('quizzes/result', { quiz: req.quiz, result: result, answer: answer});
		} 
		else {
			throw new Error('No hay preguntas en la BBDD');
		}
	}).catch(function(error) { next(error); });
};

// GET /quizzes/new
exports.new = function(req, res, next) {
	var quiz = models.Quiz.build({question: "", answer: ""});
	res.render('quizzes/new', {quiz: quiz});
};

// POST /quizzes/create
exports.create = function(req, res, next) {
	var quiz = models.Quiz.build({ question: req.body.quiz.question, answer: req.body.quiz.answer });

	// guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({ fields: ["question", "answer"]}).then(function(quiz) {
		req.flash('success', 'Quiz creado con éxito.')
		res.redirect('/quizzes');

	}).catch(Sequelize.ValidationError, function(error) {

		req.flash('error', 'Errores en el formulario');
		for (var i in error.errors) {
			req.flash('error', error.errors[i].value);
		};

		res.render('quizzes/new', { quiz: quiz });
	}).catch(function(error) {
		req.flash('error', 'Error al crear el Quiz: ' + error.message);
		next(error);
	});
};

// PUT /quizzes/:id
exports.update = function(req, res, next) {

	req.quiz.question = req.body.quiz.question;
	req.quiz.answer = req.body.quiz.answer;

	req.quiz.save({fields: ["question", "answer"]}).then(function(quiz) {
		req.flash('success', 'Quiz editado con éxito.');
		res.redirect('/quizzes');
	}).catch(Sequelize.ValidationError, function(error) {

		req.flash('error', 'Errores en el formulario:');
		for (var i in error.errors) {
			req.flash('error', error.errors[i].value);
		};

		res.render('/quizzes/edit', { quiz: req.quiz });
	}).catch(function(error) {
		req.flash('error', 'Error al editar el Quiz: ' + error.message);
		next(error);
	});
};

// DELETE /quizzes/:id
exports.destroy = function(req, res, next) {
	req.quiz.destroy().then(function() {
		req.flash('success', 'Quiz borrado con éxito.');
		res.redirect('/quizzes');
	}).catch(function(error) {
		req.flash('error', 'Error al editar el Quiz: ' + error.message);
		next(error);
	});
};