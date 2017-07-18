var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect' : 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

// var Todo = sequelize.define('todo', {
//     description:{
//         type: Sequelize.STRING,
//         allowNull: false,
//         validate:{
//             len: [1, 250]
//         }
//     },
//     completed: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false,
//         defaultValue: false
//     }
// })

sequelize.sync().then(function(){
    console.log('Everything is synced');
    Todo.create({
        description: 'Test Task',
        completed: false
    }).then(function(todo){
        return Todo.create({
            description: 'Chained Task'
        });
    }).then(function(){
        return Todo.findById(1);
    }).then(function(todo){
        if(todo){
            console.log(todo.toJSON());
        }else{
            console.log('No to do available');
        }
    }).catch(function(e){
        console.log(e);
    });
})