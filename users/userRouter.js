const express = require('express');
const User = require('./userDb');
const router = express.Router();

router.post('/', (req, res) => {

});

router.post('/:id/posts', (req, res) => {

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

};

function validatePost(req, res, next) {

};

module.exports = router;
