const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SECRET_KEY } = require('../config');
const { UserInputError } = require('apollo-server-express');

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		SECRET_KEY,
		{ expiresIn: '1h' }
	);
}

module.exports = {
	Query: {
		async getUser(_, { userId }) {
			const user = User.findById(userId);

			if (user) {
				return user;
			}
		},
	},
	Mutation: {
		async registerUser(_, { registerInput: { username, email, password, confirmPassword } }) {
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError('This username already exists', {
					errors: {
						username: 'This username is takens',
					},
				});
			}

			if (password === confirmPassword) {
				password = await bcrypt.hash(password, 12);

				const newUser = new User({
					email,
					username,
					password,
				});

				const res = await newUser.save();
				const token = generateToken(res);
				return {
					...res._doc,
					id: res._id,
					token,
				};
			} else {
				throw new UserInputError('The password do not match', {
					errors: {
						confirmPassword: 'Passwords do not match',
					},
				});
			}
		},
	},
};
