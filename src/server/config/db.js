const mongoose = require("mongoose");

// connect to the Bone database
const mongodb_connect = () => {
    console.log("Attempting to connect to the database.....");
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "Bone"
    })
        .then(() => {
            console.log("Connected to the database");
            return true;
        }).catch(err => {
            console.log(err);
            console.log("Error connecting to the database");
            process.exit(1);
        })
};




module.exports = {
    mongodb_connect

}