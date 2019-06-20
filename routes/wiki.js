const express = require('express');
const wikiRouter = express.Router();
const { addPage, wikipage, main } = require('../views');
const { Page } = require('../models');
const { User } = require('../models');

wikiRouter.use(express.urlencoded({ extended: true }));
wikiRouter.use(express.json());

const slugify = pageInstance => {
  pageInstance.slug = pageInstance.title.replace(/ +/g, '_');
};

Page.beforeValidate((pageInstance, optionsObject) => slugify(pageInstance));

wikiRouter.get('/', async (req, res, next) => {
  const allPages = await Page.findAll();
  res.send(main(allPages));
});

wikiRouter.get('/add', (req, res, next) => {
  res.send(addPage());
});

wikiRouter.get('/:slug', async (req, res, next) => {
  try {
    const foundPost = await Page.findOne({
      where: { slug: req.params.slug },
    });

    const author = await foundPost.getAuthor();
    if (!foundPost) {
      res.sendStatus(404);
    } else {
      res.send(wikipage(foundPost, author));
    }
  } catch (error) {
    console.log(error);
  }
});

wikiRouter.post('/', async (req, res, next) => {
  // STUDENT ASSIGNMENT:
  // add definitions for `title` and `content`

  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise.
  try {
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.author,
        email: req.body.email,
      },
    });
    const page = await Page.create(req.body);
    page.setAuthor(user);

    await page.save();
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

module.exports = wikiRouter;
