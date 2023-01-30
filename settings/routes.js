module.exports = (app) => {
  const userController = require('./../Controller/UserController');
  const passport = require('passport');
  app.route('/api/auth/signup').post(userController.signup);
  app.route('/api/auth/signin').post(userController.signin);
  app
    .route('/api/auth/users')
    .get(
      passport.authenticate('jwt', { session: false }),
      userController.getAllUser
    );
  app
    .route('/api/userdelete')
    .delete(
      passport.authenticate('jwt', { session: false }),
      userController.deleteAllUser
    );
  app
    .route('/api/userupdate')
    .put(
      passport.authenticate('jwt', { session: false }),
      userController.updateAllUser
    );
  app
    .route('/api/user/isChecked/update')
    .put(
      passport.authenticate('jwt', { session: false }),
      userController.updateCheckUser
    );
    app
    .route('/api/user/logaut/update')
    .put(
      passport.authenticate('jwt', { session: false }),
      userController.updateLogautkUser
    );
};
