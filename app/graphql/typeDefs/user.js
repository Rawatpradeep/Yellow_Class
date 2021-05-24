const { gql } = require("apollo-server");

module.exports = gql`

type User {
  _id: String
  name: String
  user_name: String
}

type Group {
  _id: String
  userIds: [String],
  name: String
}

type SignInOutput {
  accessToken: String
  user: User!
}

type Message {
  _id: String
  from: User
  groupId: String
  content: String
}

type Query {
  users: [User]
  signIn(user_name: String! password: String!): SignInOutput!
  getUserGroups: [Group]
  getGroupMessage(groupId: String!): [Message]
}

type Mutation {
  addMessage(groupId: String! content: String!): Message
}

type Subscription {
  newMessage: Message!
}
`;
