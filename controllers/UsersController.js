import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    const users = dbClient.db.collection('users');
    users.findOne({ email }, (err, user) => {
      if (user) {
        res.status(400).json({ error: 'Already exist' });
      } else {
        const hashedPass = sha1(password);
        users
          .insertOne({
            email,
            password: hashedPass,
          })
          .then((res) => {
            res.status(201).json({ id: res.insertedId, email });
          })
          .catch((err) => console.log(err));
      }
    });
  }
}

module.exports = UsersController;
