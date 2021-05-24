const bcrypt = require("bcrypt");
const user = require("../model/user");
const Mongo = require("../../libs/mongo");


const seed = async () => {
    try {

        const mongo = new Mongo();

        var conn = (async function () {
            try {
                const connection = await mongo.getConnection();
            } catch (err) { }
        })();

        const password = await bcrypt.hash("Password@123", 6);
        console.log("sdfdsfsdfdfsdf");
        const options = [
            {
                name: "Pradeep",
                user_name: "pradeep",
                password: password
            }
            , {
                name: "Rahul",
                user_name: "rahul",
                password: password
            }, {
                name: "ravi",
                user_name: "ravi",
                password: password
            }
        ]

        for (let index = 0; index < options.length; index++) {
            const userData = options[index];
            await user.create(userData)
        }
    } catch (error) {
        console.log('error----------------------- :>> ', error);
    }

}

seed();