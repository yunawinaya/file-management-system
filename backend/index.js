const express = require('express')
const { Pool } = require('pg')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

app.use(
  cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

// Middleware
app.use(express.json())

// Routes
app.get('/api/folders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM folders')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

// Additional routes for CRUD operations

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
