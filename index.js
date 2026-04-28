const express = require('express');
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const bookRoutes = require('./routes/books');

app.use('/books', bookRoutes);

// run server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
