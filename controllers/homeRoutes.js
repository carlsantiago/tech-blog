const router = require('express').Router();
const { Comment, User, Post } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req,res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name']
        }
      ]
    });
    
    const posts = postData.map((post) => post.get({ plain: true }));
    // const userData = await User.findByPk(req.session.user_id)
    // const user = userData.get({ plain: true });

    //   res.render('homepage', { 
    //     posts, 
    //     logged_in: req.session.logged_in,
    //     title: "Home",
    //     username: user.name
    //   });

      res.render('homepage', { 
        posts, 
        logged_in: req.session.logged_in,
        title: "Home",
      });
    
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req,res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name']
        },
        {
          model: Comment
        }
      ]
    });

    const post = postData.get({ plain: true });
    console.log(post)
    res.render('post', {
      ...post,
      logged_in: req.session.logged_in,
      title: "Post by " + post.user.name
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile', withAuth, async (req,res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }]
    });

    const user = userData.get({ plain: true });
    console.log(user.posts.length)
    res.render('profile', {
      ...user,
      logged_in: true,
      title: "Dashboard",
      username: user.name
    });
  } catch(err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req,res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;