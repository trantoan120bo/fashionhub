require('dotenv').config();
require('./config/database');
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});
