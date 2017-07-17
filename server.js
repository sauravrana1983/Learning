var express = require('express');
var app = express();
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
    var matchedTodo;
    todos.forEach(function(todo) {
        if(todoID === todo.id){
            matchedTodo = todo;
        }
    });

    if(matchedTodo){
        res.json(matchedTodo);
    }else{
        res.status(404).send();
    }
});

app.get('/todos', function(req, resp){
    resp.json(todos);
});

//Post Request

app.post('/todos', function(req, res){
    var body = req.body;
    body.id = todoNextID++; 
    todos.push(body);
    res.json(body);
});

app.listen(PORT, function(){
    console.log('Express Listening on Port ' + PORT);
});