const mongoose = require("mongoose");

const collectionName = "messages";

const messageSchema = new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId, ref: "group"
        },
        from: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

        content: {
            type: String
        }
    },
    {
        collection: collectionName,
        timestamps: true
    }
);

module.exports = mongoose.model("message", messageSchema);
