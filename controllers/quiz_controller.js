var models = require('../models');

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
	})
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