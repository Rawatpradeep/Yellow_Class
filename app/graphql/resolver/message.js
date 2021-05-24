const bcrypt = require("bcrypt");
const { UserInputError, AuthenticationError, withFilter } = require("apollo-server")
const jwt = require("jsonwebtoken");
const messageModel = require("../../model/message");
const groupModel = require("../../model/group");
const { subscribe } = require("graphql");

module.exports = {
    Query: {
        getGroupMessage: async (_, args, context) => {
            try {
                const { user } = context
                if (!user) throw new AuthenticationError('Unauthenticated');
                const { groupId } = args
                const messages = await messageModel.find({ groupId }).populate("from").sort({ createdAt: -1 }).lean();
                console.log('messages---------------------- :>> ', messages);
                return messages
            } catch (error) {
                console.log('error--------------- :>> ', error);
                throw new UserInputError("Not Authorized", { errors: error });
            }

        }
    },
    Mutation: {
        addMessage: async (_, args, { user, pubsub }) => {
            try {
                if (!user) throw new AuthenticationError('Unauthenticated');
                const { groupId, content } = args;

                const { userId } = user;
                const groups = await groupModel.find({ userIds: { "$in": [userId] } }).sort({ createdAt: -1 }).lean();
                const groupIds = groups.map(group => {
                    const { _id } = group || {}
                    return `${_id}`
                })
                const message = await (await messageModel.create({ groupId, from: userId, content })).populate("from");

                pubsub.publish('NEW_MESSAGE', { newMessage: message, groupIds })
                return message
            } catch (error) {

            }
        }
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_, __, { pubsub, user }) => {
                    if (!user) throw new AuthenticationError('Unauthenticated')
                    return pubsub.asyncIterator(['NEW_MESSAGE'])
                },
                async ({ newMessage, groupIds }, _, { user }) => {

                    const { groupId } = newMessage
                    if (
                        groupIds.includes(`${groupId}`)
                    ) {
                        return true
                    }

                    return false
                }
            ),
        }
    }
}