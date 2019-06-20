const express = require('express');
const userRouter = express.Router();
const { userPages, userList, main } = require('../views');
const { Page } = require('../models');
const { User } = require('../models');

userRouter.use(express.urlencoded({ extended: true }));
userRouter.use(express.json());

userRouter.get('/', async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    res.send(userList(allUsers));
  } catch (error) {
    next(error);
  }
});

userRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
    });
    const pages = await Page.findAll({
      where: { authorId: req.params.id },
    });
    res.send(userPages(user, pages));
  } catch (error) {
    console.error(error);
  }
});

module.exports = userRouter;
