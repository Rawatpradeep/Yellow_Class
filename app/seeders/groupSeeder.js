const user = require("../model/user");
const group = require("../model/group");
const Mongo = require("../../libs/mongo");


const seed = async () => {
    try {

        const mongo = new Mongo();

        var conn = (async function () {
            try {
                const connection = await mongo.getConnection();
            } catch (err) { }
        })();

        const users = await user.find({}).lean();
        let userIds = []
        users.forEach(data => {
            const { _id } = data;
            userIds.push(_id)
        });

        const options = [
            {
                name: "Group1",
                userIds: [...userIds]
            }
            ,
            {
                name: "Group2",
                userIds: [userIds[0], userIds[1]]
            },
            {
                name: "Group3",
                userIds: [userIds[3], userIds[1]]
            }
        ]

        for (let index = 0; index < options.length; index++) {
            const groupData = options[index];
            await group.create(groupData)
        }
    } catch (error) {
        console.log('error----------------------- :>> ', error);
    }

}

seed();