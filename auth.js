const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('taskuser');

exports.authenticate = (name, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get user by name
      const user = await User.findOne({ name });

      // Match Password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) throw 'Password did not match';
        resolve(user);
      });
    } catch (err) {
      // Email not found or password did not match
      reject('Authentication Failed');
    }
  });
};
