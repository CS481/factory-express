import User from '../model/User.js';

import express from 'express';
var router = express.Router();

router.post('/', function(req, res, next) {
  res.setHeader("content-type", "text/json")
  console.log(req.body);
  let user = User.fromJsonObject(req.body);
  selectUser(user,res);
});

async function selectUser(user, res) {
  await user.select(user)
  res.send(user.toJson());
}

export default router;
