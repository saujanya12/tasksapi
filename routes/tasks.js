const Task = require('../models/Task');
const errors = require('restify-errors');
// const rjwt = require('restify-jwt-community');
// const config = require('../config');

module.exports = server => {

  // Get Tasks
  server.get('/tasks', async (req, res, next) => {
    try {
      const tasks = await Task.find({});

      res.send(tasks);
      next();
    }
    catch (err) {
      return next(new errors.InvalidContentError(`Error while fetching tasks : ${err}`));
    }
  });

  // Get single task
  server.get('/tasks/:id', async (req, res, next) => {
    try {
      const task = await Task.findOne({ _id: req.params.id });
      res.send(task);
      next();
    }
    catch (err) {
      return next(new errors.ResourceNotFoundError(`There is no data for task : ${req.params.task}`));

    }
  });

  // Add task
  server.post('/tasks', async (req, res, next) => {
    //Check for json
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    const { title, date, reminder, userId } = req.body;

    const taskObj = new Task({
      title,
      date,
      reminder,
      userId
    });

    try {
      const newTask = await taskObj.save();

      res.send(201);
      next();
    }
    catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  // Update task
  server.put('/tasks', async (req, res, next) => {
    // Check for JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    try {
      const task = await Task.updateOne(
        { _id: req.body._id },
        req.body
      );
      if (task.nModified > 0) {
        res.send(req.body);
      }
      else {
        res.send(null)
      }
      res.send(task);
      next();
    }
    catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no data with the task ${req.params.task}`
        )
      );
    }
  });

  // Delete task
  server.del(
    '/tasks/:id',
    // rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const task = await Task.findOneAndRemove({
          _id: req.params.id
        });
        res.send(204);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no data with the task ${req.params.task}`
          )
        );
      }
    }
  );
}