const { ApolloServer, gql } = require('apollo-server');
const { merge } = require("lodash");
const Mongo = require("./libs/mongo");
const contextMiddleware = require('./libs/middleWare')
const userTypeDefs = require("./app/graphql/typeDefs/user")
const resolver = require("./app/graphql/resolver")

const mongo = new Mongo();

var conn = (async function () {
    try {
        const connection = await mongo.getConnection();
    } catch (err) {
        console.log(err);
    }
})();

const typeDefs = userTypeDefs

const resolvers = resolver

const server = new ApolloServer({
    typeDefs, resolvers,
    context: contextMiddleware,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

