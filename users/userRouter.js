const express = require('express');
const User = require('./userDb');
const Post = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
    const user = req.body;
    User.insert(user)
        .then(user => {
            res.status(201).json(user);
        })
        .catch( err => {
            console.log(err + "Check your post '/' request")
            res.status(500).json({ error: "Error inserting user" })
        })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const post = req.body;
    Post.insert({ user_id, text })
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Could not add post" })
        })
});

router.get('/', (req, res) => {
    User.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Could not get" })
        })
});

router.get('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    res.status(200).json(req.user);
    // User.getById(id)
    //     .then(user => {
    //         if (user) {
    //             res.status(200).json(user);
    //         } else {
    //             res.status(404).json({ message: "User ID not found"})
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({ error: "Could not get user by ID" })
    //     })
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const { id } = req.params;
    User.getUserPosts(id)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err + " Check your .get '/:id/posts");
            res.status(500).json({ error: "Couldn't get user posts" })
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    const { id } = req.user;
    User.remove(id)
        .then(() => {
            res.status(204).end()
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Delete user didn't work" })
        })
});

router.put('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    User.update(id, { name })
        .then(() => {
            //res.status(200.json({...req.body, name }))
            User.getById(id)
                .then(user => res.status(200).json(user))
                .catch(err => {
                    console.log("error in put /:id " + err);
                    res.status(500).json({error: "error in put /:id update" })
                })
        }) 
        .catch(err => {
            console.log("error in put /:id " + err);
            res.status(500).json({error: "error updating user" })
        })
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    User.getById(id)
        .then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).json({ message: "User with that ID does not exist" })
            }
        })
};

function validateUser(req, res, next) {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name Please"})
    }
    if (typeof name != "string") {
        return res.status(400).json({ error: "Name needs to be a string"})
    }
    req.body = { name }
    next();
};

function validatePost(req, res, next) {
    const { id: user_id } = req.params;
    const { text } = req.body;

    if(!req.body) {
        return res.status(400).json({ message: "Post must have a body"})
    }
    if (!text) {
        return res.status(400).json({ message: "Post must be text"})
    }
    req.body = { user_id, text };
    next();
};

module.exports = router;
