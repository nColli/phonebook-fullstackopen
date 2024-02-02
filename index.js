const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

morgan.token('content', function(req, res) {
    return JSON.stringify(req.body);
});

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (request, response) => {
  //response.json(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length}</p> <p>${new Date()}</p>`)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}  

function isRepeated(posibleId) {
    let repeated = false

    let i = 0
    while (i < persons.length && !repeated) {
        if (persons[i].id === posibleId) {
            repeated = true
        }

        i++;
    }

    return repeated
}

const generateId = () => {
    let posibleId;
    
    do {
        posibleId = getRandomInt(0, 999999);
        //console.log(posibleId);
        //console.log('is repeated',isRepeated(posibleId));
    } while (isRepeated(posibleId));

    return posibleId
}

const isNameRepeated = (name) => {
    let repeated = false

    let i = 0
    while (i < persons.length && !repeated) {
        //console.log(persons[i].name, name, persons[i].name === name);
        if (persons[i].name === name) {
            repeated = true
        }

        i++;
    }

    return repeated
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    //console.log('body',body);
    if(!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    
    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'name and number missing'
        })
    } else {
        if (!body.name) {
            return response.status(400).json({
                error: 'name missing'
            })
        } else
            if (!body.number) {
                return response.status(400).json({
                    error: 'number missing'
                })
            }
    }
    
    if (isNameRepeated(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    //console.log(person);
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})