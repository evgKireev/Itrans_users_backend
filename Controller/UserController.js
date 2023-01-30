const response = require('./../response');
const db = require('./../settings/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const date = function timeTodo() {
  const date = new Date();
  let D = date.getDate();
  let M = date.getMonth() + 1;
  let Y = date.getFullYear();
  let H = date.getHours();
  let m = date.getMinutes();
  D < 10 ? (D = '0' + D) : D;
  M < 10 ? (M = '0' + M) : M;
  m < 10 ? (m = '0' + m) : m;
  return `${D}-${M}-${Y} | ${H}:${m}`;
};

exports.getAllUser = (req, res) => {
  db.query(
    'SELECT `id`, `name`, `email`, `data_registration`, `data_login`, `status`, isChecked FROM `user`',
    (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } else {
        response.status(200, rows, res);
      }
    }
  );
};

exports.deleteAllUser = (req, res) => {
  const deleteUser = req.query.Arrid.join(',');
  db.query(
    `DELETE FROM user WHERE id IN (${deleteUser})`,
    (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } else {
        response.status(200, rows, res);
      }
    }
  );
};

exports.updateAllUser = (req, res) => {
  const updateUser = req.body.Arrid.join(',');
  db.query(
    `UPDATE user SET status = "${req.body.status}" WHERE id in (${updateUser})`,
    (error, rows, fields) => {
      if (error) {
        console.log(error);
        response.status(400, error, res);
      } else {
        response.status(200, rows, res);
      }
    }
  );
};

exports.updateCheckUser = (req, res) => {
  db.query(
    `UPDATE user SET isChecked = "${req.body.isChecked}" WHERE id = "${req.body.id}"`,
    (error, rows, fields) => {
      if (error) {
        console.log(error);
        response.status(400, error, res);
      } else {
        response.status(200, rows, res);
      }
    }
  );
};

exports.updateLogautkUser = (req, res) => {
  console.log(req.body);
  console.log(req.body.id);

  db.query(
    `UPDATE user SET data_login = "${req.body.logaut}" WHERE id = "${req.body.id}"`,
    (error, rows, fields) => {
      if (error) {
        console.log(error);
        response.status(400, error, res);
      } else {
        response.status(200, rows, res);
      }
    }
  );
};

exports.signup = (req, res) => {
  db.query(
    "SELECT  `id`, `name`, `email`, `data_registration`, `data_login`, `status` FROM `user` WHERE `email` = '" +
      req.body.email +
      "'",

    (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } else if (typeof rows !== 'undefined' && rows.length > 0) {
        const row = JSON.parse(JSON.stringify(rows));
        const r = row[0].status;

        if (r === 'UnBlock') {
          row.map((rw) => {
            response.status(
              302,
              {
                message: `Пользователь с таким email - ${rw.email} уже зарегстрирован!`,
              },
              res
            );
            return true;
          });
        } else {
          row.map((rw) => {
            response.status(
              302,
              {
                message: `Ваш акауунт с email - ${rw.email} заблокирован!`,
              },
              res
            );
            return true;
          });
        }
      } else {
        const email = req.body.email;
        const name = req.body.name;
        const data_registration = date();
        const data_login = date();
        const status = 'UnBlock';
        const salt = bcrypt.genSaltSync(15);
        const password = bcrypt.hashSync(req.body.password, salt);
        const sql = `INSERT INTO user( name, data_registration, data_login, status, password, email) VALUES( "${name}","${data_registration}","${data_login}","${status}","${password}","${email}")`;
        db.query(sql, (error, results) => {
          if (error) {
            response.status(400, error, res);
          } else {
            response.status(
              200,
              { message: `Регистрация прошла успешно.`, results },
              res
            );
          }
        });
      }
    }
  );
};

exports.signin = (req, res) => {
  db.query(
    "SELECT `id`, `email`, `password`, `status` FROM `user` WHERE `email` = '" +
      req.body.email +
      "'",
    (error, rows, fields) => {
      if (error) {
        response.status(400, error, res);
      } else if (rows.length <= 0) {
        response.status(
          401,
          {
            message: `Пользователь с email - ${req.body.email} не найден. Пройдите регистрацию.`,
          },
          res
        );
      } else {
        const row = JSON.parse(JSON.stringify(rows));
        const r = row[0].status;
        if (r === 'Block') {
          row.map((rw) => {
            response.status(
              302,
              {
                message: `Ваш акауунт с email - ${rw.email} заблокирован!`,
              },
              res
            );
            return true;
          });
        } else {
          row.map((rw) => {
            const password = bcrypt.compareSync(req.body.password, rw.password);
            if (password) {
              const token = jwt.sign(
                {
                  userId: rw.id,
                  email: rw.email,
                },
                'jwt key',
                { expiresIn: 120 * 120 }
              );
              response.status(
                200,
                { token: `Bearer ${token}`, id: rw.id },
                res
              );
            } else {
              response.status(401, { message: `Пароль не верный.` }, res);
            }
            return true;
          });
        }
      }
    }
  );
};
