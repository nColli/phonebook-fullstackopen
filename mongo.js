const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://nc:${password}@cluster0.cnbhqo7.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema) //constructor

//console.log(process.argv);

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("Phonebook");
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close()
    })
} else {
    //objeto a añadir
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    //agrego a db
    person.save().then(result => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}


