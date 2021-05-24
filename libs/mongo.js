const mongoose = require("mongoose");

class Mongo {
    constructor() {
        const connectingUrl = "mongodb+srv://yellow_class:aZ4smvwxwcdMUs3e@cluster0.uxj8o.mongodb.net/Yellow_class?retryWrites=true&w=majority"
        this.db = mongoose.connect(connectingUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.connection
            .on("error", err => {
                console.log('error in DB connection----------- :>> ', err);
            })
            .on("open", () => {
                console.log('DB connection successfull ');
            });
    }

    getConnection() {
        return this.db;
    }

    disconnectConnection() {
        mongoose.connection.close();
    }
}

module.exports = Mongo;
