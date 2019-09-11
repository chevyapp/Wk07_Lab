let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

//Reference schemas
const Developer = require('./models/developer');
const Tasks = require('./models/tasks');

//Express instance
let app = express();

app.use(express.static(__dirname + '/public'));
let path2public = __dirname + '/public/';

//Configure Express to handle the engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Required to parse url encoded data into req.body
app.use(bodyParser.urlencoded({
    extended: false
}))

//Required to use the body as a json
app.use(bodyParser.json());

//Create Mongoose URL
let url = 'mongodb://localhost:27017/tasksDB';
//Connect
mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');
    
});

//Homepage
app.get('/', function (req, res) {
    res.sendFile(path2public + '/index.html');
})

//Insert new task page
app.get('/newTask', function (req, res) {
    Developer.find({}, function (err, data) {
        res.render(path2public + 'newTask.html', {db: data});
    });
})

//Post request for new task page
app.post('/newTask', function (req, res) {
    let task = new Tasks({
        _id: new mongoose.Types.ObjectId(),
        taskName: req.body.taskName,
        assignTo: req.body.assignTo,
        taskDue: new Date (req.body.taskDue),
        taskStatus: req.body.taskStatus,
        taskDesc: req.body.taskDesc
    });

    task.save(function (err) {
        if (err) throw err;
        console.log('New task successfully added to DB'); 
    });

    res.redirect('listTasks');    
})

//Get all tasks page
app.get('/listTasks', function (req, res) {
    Tasks.find({}, function (err, data) {
        res.render(path2public + 'listTasks.html', {db: data});
    });
})

//Delete Task
app.get('/deleteTask', function(req, res){
    Tasks.find({}, function (err, data) {
        res.render(path2public + 'deleteTask.html', {db: data});
    });
});

app.post('/deleteTask', function(req, res){
    //ID is an object, hence must change to object - cannot use string directly
    let query = { '_id': mongoose.Types.ObjectId(req.body._id)};
    
    console.log(req.body);

    Tasks.deleteOne(query, function (err, doc){
        console.log(doc);
    });
    
    res.redirect('listTasks');
});

//Delete all completed tasks
app.get('/deleteCompleted', function(req, res){
    res.sendFile(path2public + 'deleteCompleted.html');
});

//Post request for Delete all completed
app.post('/deleteCompleted', function(req, res){
    let query = {taskStatus: 'complete'};
    Tasks.deleteMany(query, function () {
        res.redirect('listTasks')
    });
});

//Update Task Status
app.get('/updateStatus', function(req, res){
    Tasks.find({}, function (err, data) {
        res.render(path2public + 'updateStatus.html', {db: data});
    });
});

//Post method for update task status
app.post('/updateStatus', function(req, res){
    let query = { '_id': mongoose.Types.ObjectId(req.body._id)};
    let status = { taskStatus: req.body.taskStatus};
    Tasks.updateOne(query, {$set: status}, function(err, doc){
        console.log(doc);
    });
    res.redirect('listTasks');
});

//Add a new developer
app.get('/newDeveloper', function (req, res){
    res.render(path2public + 'newDeveloper.html');
});

//Post request for new developer
app.post('/newDeveloper', function (req, res){
    let developer = new Developer({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        level: req.body.level,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        }
    });

    developer.save(function (err) {
        if (err) throw err;
        console.log('New developer successfully added to DB'); 
    });

    res.redirect('listDevelopers');

});

//Get all developers page
app.get('/listDevelopers', function (req, res) {
    Developer.find({}, function (err, data) {
        res.render(path2public + 'listDevelopers.html', {db: data});
    });

})

app.listen(8080, () => {
    console.log('server started...');
})