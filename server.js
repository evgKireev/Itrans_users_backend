const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const passport = require('passport');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
);
require('./middleware/passport')(passport);

const routes = require('./settings/routes');
routes(app);


app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`);
});
