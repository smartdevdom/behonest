const chalk = require('chalk');
const mongoose = require('mongoose');
const app = require('./config/middleware');
const config = require('./config');

// Connect to mongoDB
mongoose
  .connect(config.mongoDb)
  .then(() => console.log(`  MongoDB is: ${chalk.green('running')}`))
  .catch((err) => console.log(err))


// Server config
app.listen(config.port, (err) => {
  if (err) throw new Error(err);
  console.log(`
  Server running on port: ${chalk.green(config.port)}
  Environment: ${chalk.yellow(config.env)}
  `);
});