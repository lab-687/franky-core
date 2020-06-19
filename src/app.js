const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Users = require('./models/users');

const indexRoutes = require('./routes/index-routes');
const usersRoutes = require('./routes/users-routes');
const environmentRoutes = require('./routes/environment-routes');
const propertiesRoutes = require('./routes/properties-routes');
const profilesRoutes = require('./routes/profiles-routes');
const categoriesRoutes = require('./routes/categories-routes');
const groupsRoutes = require('./routes/groups-routes');

const cors = require('cors');

require('dotenv-safe').config();



mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Mongoose default connection is open');
});

db.on('error', err => {
    console.log(`Mongoose default connection has occured \n${err}`);
});

db.on('disconnected', () => {
    console.log('Mongoose default connection is disconnected');
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log(
        'Mongoose default connection is disconnected due to application termination'
        );
        process.exit(0);
    });
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/', indexRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/profile', profilesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/groups', groupsRoutes);

module.exports = app;
