const express = require('express')
const wikiRouter = express.Router();
// const {wikipage} = require('../views');
const {addPage, wikipage, main} = require('../views');
const { Page } = require('../models');

wikiRouter.use(express.urlencoded({ extended: true }));
wikiRouter.use(express.json());

const slugify = (pageInstance) => {
    pageInstance.slug = pageInstance.title.replace(/ +/g, '_')
}

Page.beforeValidate((pageInstance, optionsObject) => slugify(pageInstance))

wikiRouter.get('/', async (req, res, next) => {
    const allPages = await Page.findAll()
    console.log(allPages)
    res.send(main(allPages))
})

wikiRouter.get('/add', (req, res, next) => {
    res.send(addPage())
})

wikiRouter.get('/:slug', async (req, res, next) => {
    try {
        const foundPost = await Page.findOne({
        where: {slug: req.params.slug}
    });
    // console.log(foundPost)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
    res.send(wikipage(foundPost))
    }
    } catch (error) {
        console.log(error);
    }
})

wikiRouter.post('/', async (req, res, next) => {

  // STUDENT ASSIGNMENT:
  // add definitions for `title` and `content`

  const page = new Page({
    title: req.body.title,
    content: req.body.content
  });

  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise.
  try {
    await page.save();
    console.log(page);
    res.redirect('/');
  } catch (error) { next(error) }
});



module.exports = wikiRouter;