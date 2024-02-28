require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Define your schema
const Schema = mongoose.Schema;
const personSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: [String]
});

// Create the model
const Person = mongoose.model('Person', personSchema);
// Create and save a record of a model
const person = new Person({
    name: 'John',
    age: 30,
    favoriteFoods: ['Pizza', 'Burger']
  });
  person.save(function(err, data) {
    if (err) return console.error(err);
    console.log('Record saved successfully:', data);
  });
  
  // Create many records with model.create()
  const arrayOfPeople = [
    { name: 'Alice', age: 25, favoriteFoods: ['Sushi', 'Pasta'] },
    { name: 'Bob', age: 35, favoriteFoods: ['Steak', 'Salad'] }
  ];
  Person.create(arrayOfPeople, function(err, people) {
    if (err) return console.error(err);
    console.log('Multiple records created:', people);
  });
  
  // Use model.find() to search your database
  Person.find({ name: 'John' }, function(err, people) {
    if (err) return console.error(err);
    console.log('People with name "John":', people);
  });
  
  // Use model.findOne() to return a single matching document from your database
  Person.findOne({ favoriteFoods: 'Pizza' }, function(err, person) {
    if (err) return console.error(err);
    console.log('Person with Pizza as a favorite food:', person);
  });
  
  // Use model.findById() to search your database by _id
  const personId = 'your_person_id';
  Person.findById(personId, function(err, person) {
    if (err) return console.error(err);
    console.log('Person with ID', personId, ':', person);
  });
  
  // Perform classic updates by running find, edit, then save
  Person.findById(personId, function(err, person) {
    if (err) return console.error(err);
    person.favoriteFoods.push('Hamburger');
    person.save(function(err, updatedPerson) {
      if (err) return console.error(err);
      console.log('Person updated:', updatedPerson);
    });
  });
  
  // Perform new updates on a document using model.findOneAndUpdate()
  const personName = 'Alice';
  Person.findOneAndUpdate({ name: personName }, { age: 20 }, { new: true }, function(err, updatedPerson) {
    if (err) return console.error(err);
    console.log('Updated person:', updatedPerson);
  });
  
  // Delete one document using model.findByIdAndRemove
  Person.findByIdAndRemove(personId, function(err, removedPerson) {
    if (err) return console.error(err);
    console.log('Removed person:', removedPerson);
  });
  
  // MongoDB and Mongoose - Delete many documents with model.remove()
  Person.remove({ name: 'Mary' }, function(err, result) {
    if (err) return console.error(err);
    console.log('Deleted', result.deletedCount, 'documents');
  });
  
  // Chain search query helpers to narrow search results
  Person.find({ favoriteFoods: 'Burritos' })
        .sort('name')
        .limit(2)
        .select('-age')
        .exec(function(err, data) {
          if (err) return console.error(err);
          console.log('People who like burritos:', data);
        });
  