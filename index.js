const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));
  const express = require('express');
const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.listen(3000, () => console.log('Server running on port 3000'));
app.get('/check-db', async (req, res) => {
    try {
      await mongoose.connection.db.admin().ping(); // Ping để check kết nối
      res.status(200).json({ message: 'Database connected successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Database connection failed', error: err.message });
    }
  });