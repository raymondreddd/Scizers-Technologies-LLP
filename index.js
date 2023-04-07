const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');

const app = express();
// const connectDB = require('./db')

const connection_url = 'mongodb+srv://dubeydhruv020:123LMS123@cluster0.svcbbne.mongodb.net/?retryWrites=true&w=majority';

console.log(connection_url)

const connectDB = async () => {
    console.log('inside f');
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(connection_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // make the process fail
        process.exit(1);
    }
}

connectDB()

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true }
});
  
const Contact = mongoose.model('Contact', contactSchema);

// set up handlebars view engine
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Index route
app.get('/', (req, res) => {
  Contact.find({})
    .sort({ name: 'asc' })
    .then(contacts => {
      res.render('index', {
        contacts: contacts
      });
    });
});

// Add Contact form route
app.get('/add', (req, res) => {
  res.render('add');
});

// Edit Contact form route
app.get('/edit/:id', (req, res) => {
  Contact.findOne({
    _id: req.params.id
  })
    .then(contact => {
      res.render('edit', {
        contact: contact
      });
    });
});

// Add Contact route
app.post('/add', (req, res) => {
  Contact.findOne({mobile: req.body.mobile})
    .then(contact => {
      if (contact) {
        res.render('add', {
          error: 'Mobile number already exists',
          name: req.body.name,
          mobile: req.body.mobile
        });
      } else {
        const newContact = {
          name: req.body.name,
          mobile: req.body.mobile
        }
        new Contact(newContact)
          .save()
          .then(contact => {
            res.redirect('/');
          });
      }
    });
});

// Update Contact route
app.post('/update/:id', (req, res) => {
  Contact.findOne({
    _id: req.params.id
  })
    .then(contact => {
      // Update contact
      contact.name = req.body.name;
      contact.mobile = req.body.mobile;
      contact.save()
        .then(contact => {
          res.redirect('/');
        });
    });
});

// Delete Contact route
app.get('/delete/:id', (req, res) => {
  Contact.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/');
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});