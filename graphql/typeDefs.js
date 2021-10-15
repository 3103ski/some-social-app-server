const { gql } = require('apollo-server-express');

module.exports = gql`
	type User {
		username: String!
		token: String!
		id: ID!
		email: String!
		createdAt: String!
	}

	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String!
	}

	type Query {
		getUser(userId: ID!): User
	}

	type Mutation {
		registerUser(registerInput: RegisterInput): User!
	}
`;
