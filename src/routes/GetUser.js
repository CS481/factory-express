import User from '../model/User.js';

import express from 'express';
import ServerException from '../exception/ServerException.js';
import UnimplementedError from '../exception/UnimplementedError.js';

var router = express.Router();

router.post('/', async function(req, res, next) {
  try {
    res.setHeader("content-type", "text/json")
    let user = new User();
    await user.fromJsonObject(req.body);
    res.send(user.toJsonObject());
  } catch (e) {
    if (e instanceof ServerException) {
      e.setResponse(res);
    } else {
      new UnimplementedError(e).setResponse(res);
    }
  }

});

export default router;
