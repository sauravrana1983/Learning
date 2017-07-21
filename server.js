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
    db.todo.findById(todoID).then(function(todo){
                if(!!todo){
                    res.json(todo.toJSON());
                }else{
                    res.status(404).send();
                }   
            } , function(e){
                res.status(500).send();
            });    
    });


app.get('/todos', function(req, res){
    var query = req.query;
    var where = {};
    if(query.hasOwnProperty('completed') && query.completed === 'true'){
        where.completed = true;
    }else if(query.hasOwnProperty('completed') && query.completed === 'false'){
        where.completed = false;
    }

    if(query.hasOwnProperty('q') && query.q.length > 0){
        where.description ={
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({where: where}).then(function(todos){
        res.json(todos);
    }, function(e){
        res.status(500).send();
    });
});

//Post Request

app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }, function(e){
        res.status(400).json(e);
    });
});

app.delete('/todos/:id', function(req, res){
    var todoID = parseInt(req.params.id, 10);
    db.todo.destroy({
        where: {
            id: todoID
        }
    }).then(function(rowsDeleted){
        if(rowsDeleted === 0){
            res.status(404).json({
                error: 'No todo with id'
            });
        } else {
            res.status(204).send();
        }
        
    }, function(){
        res.status(500).send();
    })
});

app.put('/todos/:id', function(req, res){
    var todoID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};

    if(body.hasOwnProperty('completed')){
        attributes.completed = body.completed;
    }

    if(body.hasOwnProperty('description')){
        attributes.description = body.description;
    }

    db.todo.findById(todoID).then(function(todo){
        if(todo){
         todo.update(attributes).then(function(todo){
                res.json(todo.toJSON());
                }, function(e){
                        res.status(400).json(e);
            });
        } else{
            res.status(404).send()
        }
    }, function () {
        res.status(500).send();
    });
});



db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
    console.log('Express Listening on Port ' + PORT);
    });
})