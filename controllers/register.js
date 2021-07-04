const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, password, name } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  if (!email || !password || !name) {
    return res.status(400).json("Incorrect Form Submission");
  }
  db.transaction(trx => {
    trx
      .insert({ hash: hash, email: email })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then(user => {
            res.json(user[0]);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch(err => res.status(400).json(err));
  }).catch(err => res.status(400).json(err));
};

module.exports = {
  handleRegister: handleRegister,
};
