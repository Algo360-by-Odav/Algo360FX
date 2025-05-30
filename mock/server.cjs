const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Add custom routes before router
server.get('/api/notifications', (req, res) => {
  const db = router.db;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const notifications = db.get('notifications').value();
  
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedNotifications = notifications.slice(start, end);
  
  res.jsonp({
    data: paginatedNotifications,
    pagination: {
      page,
      limit,
      total: notifications.length,
      totalPages: Math.ceil(notifications.length / limit)
    }
  });
});

server.get('/api/notifications/preferences', (req, res) => {
  const db = router.db;
  const preferences = db.get('notification_preferences.dev-user').value();
  res.jsonp(preferences);
});

server.get('/api/user/preferences', (req, res) => {
  const db = router.db;
  const preferences = db.get('preferences.dev-user').value();
  res.jsonp(preferences);
});

// Use default middlewares (cors, static, etc)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
server.use(jsonServer.bodyParser);

// Rewrite routes to begin with /api
server.use('/api', router);

const port = 3004;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
