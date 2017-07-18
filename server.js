var express = require('express');
var app = express();
var _ = require('underscore');
var db = require('./db.js');

var PORT = process.env.PORT || 3000;
var todos =[];
var todoNextID = 1;
var bodyParser = require('body-parser');

app.use(bodyParser.json()); //Adding the JSON parser middleware

app.get('/', function(req, res){
    res.send("ToDo API Root");
});

app.get('/todos/:id', function(req, res){
    var todoID= parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoID});

    if(matchedTodo){
        res.json(matchedTodo);
    }else{
        res.status(404).send();
    }
});

app.get('/todos', function(req, resp){
    var queryParams = req.query;
    var filteredToDo = todos;
    if(queryParams.hasOwnProperty('completed') &&  queryParams.completed === 'true'){
        filteredToDo = _.where(filteredToDo, {completed: true});
    }else if(queryParams.hasOwnProperty('completed')&&  queryParams.completed === 'false'){
        filteredToDo = _.where(filteredToDo, {completed: false});
    }

    if(queryParams.hasOwnProperty('q') &&  queryParams.q.length > 0){
        filteredToDo = _.filter(filteredToDo, function(todo){
            return todo.indexOf(queryParams.q) > -1;
        })
    }
    
    resp.json(filteredToDo);
});

//Post Request

app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }, function(e){
        res.status(400).json(e);
    });
    // if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    //     return res.status(400).send();
    // }

    // body.description = body.description.trim();
    // body.id = todoNextID++; 
    // todos.push(body);
    // res.json(body);
});

app.delete('/todos/:id', function(req, res){
    var todoID = parseInt(req.params.id, 10);
    var matchedToDo = _.findWhere(todos,{id: todoID});
    if(!matchedToDo){
        res.status(404).json({"error" : "no todo found with the id"});
    }else{
         todos = _.without(todos, matchedToDo);
         res.json(matchedToDo);
    }
});

app.put('/todos/:id', function(req, res){
    var todoID = parseInt(req.params.id, 10);
    var matchedToDo = _.findWhere(todos,{id: todoID});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if(!matchedToDo){
        return res.status(404).send();
    }

    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
    }else if(body.hasOwnProperty('completed')){
        return res.status(400).send();
    }

    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttributes.description = body.description;
    }else if(body.hasOwnProperty('description')){
        return res.status(400).send();
    }

    _.extend(matchedToDo, validAttributes);
    res.json(matchedToDo);
});



db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
    console.log('Express Listening on Port ' + PORT);
    });
})