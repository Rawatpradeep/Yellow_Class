const userResolvers = require('./user')
const groupResolvers = require('./group')
const messageResolver = require("./message");

module.exports = {
    Query: {
        ...userResolvers.Query,
        ...groupResolvers.Query,
        ...messageResolver.Query
    },
    Mutation: {
        ...messageResolver.Mutation
    },
    Subscription: {
        ...messageResolver.Subscription
    }
}