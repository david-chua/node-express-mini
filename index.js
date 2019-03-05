// implement your API here
const express = require('express');
const db = require('./data/db');

const port = 8080;
const server = express();

server.use(express.json());

server.get('/api/users', (req,res) => {
  db.find()
    .then(users => {
      res.json(users)
    })
    .catch(error => {
      res.status(500).json({err: 'The users information could not be retrieved'})
    })
})

server.get('/api/users/:id', (req,res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.status(404).json({err: "The user with the specified ID does not exist"})
      }
    })
    .catch(error => {
      res.status(500).json({error: "The user information could not be retrieved"})
      })
})

server.post('/api/users', (req,res) => {
  const newUser = req.body;

  if (newUser.name && newUser.bio){
    db.insert(newUser)
      .then(dbUser => {
        res.status(201).json(dbUser)
      })
      .catch(err => {
        res.status(500).json({err: 'There was an error while saving the user to the database'} );
      })
  } else {
    res.status(400).json({err: 'Please Provide name and bio for the user' })
  }
})

server.delete('/api/users/:id', (req,res) => {
  const { id } = req.params;
  db.remove(id)
  .then(user => {
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({err: "The user with the specified ID does not exist"})
    }
  })
    .catch(err => {
      res.status(500).json({err: "The user could not be removed" })
    })
})

server.put('/api/users/:id', (req,res) => {
  const { id } = req.params;
  const userEdit = req.body;

  if (userEdit.name && userEdit.bio){
    db.update(id, userEdit)
    .then(user => {
      if (user) {
        res.status(200).json({message: "OK"})
      } else {
        res.status(404).json({err: "The user with the specified ID does not exist"})
      }
    })
    .catch(err => {
      res.status(500).json({err: "The user information could not be modified" })
    })
  } else {
    res.status(400).json({err: 'Please Provide name and bio for the user' })
  }
})

server.listen(port, () => {
  console.log(`Our server is listening on ${port}`);
})
