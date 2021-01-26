import User from '../model/User.js';

import express from 'express';
var router = express.Router();

router.post('/', async function(req, res, next) {
  res.setHeader("content-type", "text/json")
  let user = new User();
  await user.fromJsonObject(req.body);
  res.send(user.toJsonObject());
});

export default router;
