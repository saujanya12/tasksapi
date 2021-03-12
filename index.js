const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require('restify-jwt-community');
const corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer();

// Middleware
const cors = corsMiddleware({
    origins: [config.URL, /^http?:\/\/taskslist-app.herokuapp.com(:[\d]+)?$/],
    allowHeaders: ['Authorization'],
   // exposeHeaders: ['API-Token-Expiry']
})

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.bodyParser());

// Protect Routes
server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/register', '/auth'] }));

server.listen(config.PORT, () => {
    mongoose.set('useFindAndModify', false);
    mongoose.connect(config.MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
});

const db = mongoose.connection;

db.on('error', err => console.log(err));

db.once('open', () => {

    require('./routes/tasks')(server);
    require('./routes/users')(server);
    console.log(`Server started on port ${config.PORT}`);
});