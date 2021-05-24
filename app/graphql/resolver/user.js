const bcrypt = require("bcrypt");
const { UserInputError } = require("apollo-server")
const jwt = require("jsonwebtoken");
const userModel = require("../../model/user");
const { JWT_SECRET, SALT, TOKEN_EXPIRE } = require('../../../config/env.json')

module.exports = {
    Query: {
        signIn: async (_, args) => {
            const { user_name, password } = args;
            let errors;
            try {
                const user = await userModel.findOne({ user_name }).lean();
                if (!user || user == null) {
                    errors = "UserName is not valid"
                    throw errors
                }

                const { password: userPassword } = user || {};

                const passwordMatch = await bcrypt.compare(password, userPassword);
                if (!passwordMatch) {
                    errors = "Password is incorrect";
                    throw errors
                }

                const accessToken = await jwt.sign(
                    {
                        userId: user._id
                    },
                    JWT_SECRET,
                    {
                        expiresIn: TOKEN_EXPIRE
                    }
                );

                return {
                    accessToken: accessToken,
                    user
                };
            } catch (error) {
                console.log('error--------------- :>> ', error);
                throw new UserInputError("Not Authorized", { errors: error });
            }

        }
    }
}