const express = require("express");

const db = require("./db.js");

const server = express();

server.use(express.json());

server.get('/api/cars', (req, res) =>
  db('cars')
    .then(cars => res.status(200).json(cars))
    .catch(() => res.status(500).json({message: 'Failed to get car information.'}))
);

server.get('/api/cars/:id', ({params: {id}}, res) =>
  db('cars')
    .where({id})
    .first()
    .then(car => {
      if (!car) return res.status(404).json({message: 'Car not found'});

      return res.status(200).json(car);
    })
    .catch(() => res.status(500).json({message: 'Error getting car information'}))
);

server.post('/api/cars', ({body: {make, model, mileage, transmission, status}}, res) =>
  db('cars')
    .insert({make, model, mileage, transmission, status})
    .then(([id]) =>
      db('cars')
        .where({id})
        .first()
        .then(car => res.status(201).json(car))
    )
    .catch(() => res.status(500).json({message: 'Error creating car'}))
);

server.delete('/api/cars/:id', ({params: {id}}, res) =>
  db('cars')
    .where({id})
    .del()
    .then(count => {
      if (count === 0) return res.status(404).json({message: 'Car not found'});

      res.status(200).json({message: 'Car deleted'});
    })
    .catch(() => res.status(500).json({message: 'Error deleting car'}))
);

server.put('/api/cars/:id', ({params: {id}, body: {make, model, mileage, transmission, status}}, res) =>
  db('cars')
    .where({id})
    .update({make, model, mileage, transmission, status})
    .then(() =>
      db('cars')
        .where({id})
        .first()
        .then(car => res.status(200).json(car))
    )
    .catch(() => res.status(500).json({message: 'Error updating car'}))
);


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n== API running on port ${PORT} ==\n`);
});
