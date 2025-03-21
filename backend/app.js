const notificationsRouter = require('./routes/notifications');

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/notifications', notificationsRouter); 