const bcrypt = require("bcrypt");
const { UserInputError, AuthenticationError } = require("apollo-server")
const jwt = require("jsonwebtoken");
const groupModel = require("../../model/group");

module.exports = {
    Query: {
        getUserGroups: async (_, args, context) => {
            try {
                const { user } = context
                if (!user) throw new AuthenticationError('Unauthenticated');
                const { userId } = user
                const groups = await groupModel.find({ userIds: { "$in": [userId] } }).sort({ createdAt: -1 }).lean();

                return groups
            } catch (error) {
                console.log('error--------------- :>> ', error);
                throw new UserInputError("Not Authorized", { errors: error });
            }

        }
    }
}