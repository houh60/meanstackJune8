const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const user = require('../Models/user.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel.js");
const cors = require('cors');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

router.options("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", req.get("Origin") || "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	//other headers here
	res.status(200).end();
});

router.get('/enroll', function (req, res, next) {
	user.find(function (err, user) {
		if (err)
			return next(err);
		res.json(user);
	});
});

router.get('/enroll/:id', function (req, res, next) {
	user.findById(req.params.id, function (err, user) {
		if (err)
			return next(err);
		res.json(user);
	});
});

router.put('/enroll/:id', function (req, res, next) {
	user.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
		console.log(req.params.id);
		if (err)
			return next(err);
		res.json(user);
	});
});

router.post('/enroll', function (req, res, next) {
	user.create(req.body, function (err, user) {
		if (err)
			return next(err);
		res.json(user);
	});
});

router.delete('/enroll/:id', function (req, res, next) {
	user.findByIdAndRemove(req.params.id, req.body, function (err, user) {
		console.log(req.params.id);
		if (err)
			return next(err);
		res.json(user);
	});
});

router.post('/signup', function (req, res) {
	var saltRounds = 0;
	console.log(req.body);
	bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
		if (err)
			return res.status(500).json({ error: err });
		else {
			const user = new User({
				email: req.body.email,
				password: hash
			});
			user.save().then(function (result) {
				console.log(result);
				res.status(200).json({
					success: 'New user has been created.'
				});
			}).catch(() => {
				res.status(500).json({
					error: err
				});
			});
		}
	});
});

router.post('/signin', function (req, res) {
	User.findOne({ email: req.body.email }).then(function (user) {
		bcrypt.compare(req.body.password, user.password, function (err, result) {
			if (err)
				return res.status(401).json({ failed: "Unauthorized" });
			if (result) {
				const JWTToken = jwt.sign({
					email: user.email,
					_id: user._id
				},
					'secret',
					{
						expiresIn: '2h'
					});
				return res.status(401).json({
					success: 'Welcome to the JWT Auth',
					token: JWTToken
				});
			}
			return res.status(401).json({
				failed: 'Unauthorized Access'
			});
		});
	})
		.catch(error => {
			res.status(500).json({
				error: error
			});
		});
});

router.post('/posts', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secret', (err, authData) => {
		if (err)
			res.sendStatus(403);
		else
			res.json({
				msg: "A new post is created.",
				authData
			});
	});
});

function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'underfined') {
		const bearer = bearerHeader.split(' ')
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	}
	else
		res.sendStatus(403);
}

module.exports = router;