const mongoose = require("mongoose");
const collectionName = "users";
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        user_name: {
            type: String,
            unique: true,
            index: true,
        },
        password: {
            type: String
        },
    },
    {
        collection: collectionName,
        timestamps: true
    }
);

module.exports = mongoose.model("user", userSchema);
