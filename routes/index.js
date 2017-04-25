var express = require('express');
var router = express.Router();
var Task = require('../models/task.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    // Searches for task objects that are not completed
    // to display.
    Task.find({completed:false}, function(err, tasks) {
        if (err) {
            return next(err);
        }
        res.render('index', { title: 'TODO list' , tasks: tasks });
    });
});

// Action from clicking the add button.
router.post('/add', function(req, res, next){
    // Checks if the field is empty.
    if (!req.body || !req.body.text) {
        req.flash('error', 'Please enter some text');
        res.redirect('/');
    }
    else {
        // Creates a new task object with the text field's value.
        var task = Task({ text : req.body.text, completed: false});
        task.save(function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/')
        });
    }
});

// Action from clicking the done button.
router.post('/done', function(req, res, next) {
    // Captures the object's id.
    var id = req.body._id;
    // Searches through task objects for id and updates
    // completed value if found.
    Task.findByIdAndUpdate(id, {completed:true}, function(err, task){
            if (err) {
                return next(err);
            }
            if (!task) {
                var req_err = new Error('Task not found');
                req_err.status = 404;
                return next(req_err);
            }
            // Displays flash message.
            req.flash('info', 'Marked as completed');
            return res.redirect('/')
        }
    );
});

// Action from clicking the completed tasks link.
router.get('/completed', function(req, res, next) {
    // Searches through tasks for completed ones.
    Task.find({completed:true}, function(err, tasks){
        if (err) {
            return next(err);
        }
        res.render('tasks_completed', { title: 'Completed tasks', tasks: tasks });
    });
});

// Action from clicking the delete button.
router.post('/delete', function(req, res, next) {
    // Captures the task object's id.
    var id = req.body._id;
    // Searches through tasks for matching id.
    Task.findByIdAndRemove(id, function(err, task) {
        if (err) {
            return next(err);
        }
        if (!task) {
            var req_err = new Error('Task not found');
            req_err.status = 404;
            return next(req_err);
        }
        // Displays flash message.
        req.flash('info', 'Deleted');
        return res.redirect('/')
    })
});

// Action from clicking the all done button.
router.post('/alldone', function(req, res, next) {
    // Updates all tasks that are false.
    Task.update(
        {completed:false}, {completed:true}, {multi:true}, function(err){
            if (err) {
                return next(err);
            }
            // Displays flash message.
            req.flash('info', 'All tasks are done!');
            return res.redirect('/')
        }
    );
});

module.exports = router;
