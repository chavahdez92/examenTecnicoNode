const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/examen-tecnico',{
    useNewUrlParser :true,
    useUnifiedTopology: true
})
    .then(db => console.log('Database in connected'))
    .catch(err => console.log(err));