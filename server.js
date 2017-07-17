var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos =[{
        id: 1,
        descripton: 'meeting',
        completed: false
    },
    {
        id: 2,
        descripton: 'Demo Completion',
        completed: false
    },
    {
        id: 3,
        descripton: 'BMW Demo',
        completed: true
    }];

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
})

app.listen(PORT, function(){
    console.log('Express Listening on Port ' + PORT);
});