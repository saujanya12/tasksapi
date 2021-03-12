const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    date:{
        type: String,
        required: false,
        default: '',
        trim: true
    },
    reminder:{
        type: Boolean,
        required: false,
        default: false,
        trim: false
    },
    userId:{
        type: mongoose.Types.ObjectId,
        required: false,
        trim: false
    },
    updatedAt:{
        type: Date
    }
});

TaskSchema.plugin(timestamp);

const Task = mongoose.model('task', TaskSchema);
module.exports = Task;