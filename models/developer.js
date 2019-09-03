let mongoose = require('mongoose');

//Schema for developer
var developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        required: true,
        validate: {
            validator: function (levelValue) {
                return levelValue === "BEGINNER" || levelValue === "EXPERT";
            },
            message: 'Level should be either BEGINNER or EXPERT'
        }
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: String
    }
});
//make it a model and export
module.exports = mongoose.model('Developer', developerSchema);