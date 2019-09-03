let mongoose = require('mongoose');

//Schema for Tasks
var taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    taskName: String,
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    taskDue: Date,
    taskStatus: {
        type: String,
        validate: {
            validator: function (statusValue) {
                return statusValue === "inProgress" || statusValue === "complete";
            },
            message: 'Status can be either inProgress or complete'
        }
    },
    taskDesc: String
});
//make it a model and export
module.exports = mongoose.model('Tasks', taskSchema);
