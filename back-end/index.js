const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');
const app = express();
const cors = require('cors');
app.use(express.json());  
app.use(cors());
app.use(routes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
