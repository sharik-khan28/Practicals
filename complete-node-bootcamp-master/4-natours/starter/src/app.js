const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

const tourRouter = require('./routes/tour.router');
const userRouter = require('./routes/user.router');

app.use(
  cors({
    origin: '*',
  })
);

app.use(morgan('dev'));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/overview', express.static('overview.html'));
app.use('/tour', express.static('tour.html'));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
