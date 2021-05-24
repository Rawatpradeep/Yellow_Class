const mongoose = require("mongoose");

const collectionName = "groups";

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    },
    {
        collection: collectionName,
        timestamps: true
    }
);

module.exports = mongoose.model("group", groupSchema);
