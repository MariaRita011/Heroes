const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "batalhas",
  password: "ds564",
  port: 5432,
});

app.get("/heroes", async (req, res) => {

    const {photo} = req.query;
    
  try {
    const result = await pool.query("SELECT * FROM heroes");
    if (result.rowCount == 0) {
      res.status(201).send({ Aviso: "Nenhum herói cadastrado!" });
    } else {
      res.json({
        total: result.rowCount,
        heroes: result.rows,
      });
    }
  } catch (error) {
    console.error("Erro ao obter os heróis cadastrados:", error);
    res.status(500).send("Erro ao obter os heróis cadastrados");
  }
});


// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});