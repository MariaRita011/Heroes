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

app.post("/heroes", async (req, res) => {
  try {
    const { name, strength, healthPoints, carSpeed } = req.body;

    if (!name || !strength || !healthPoints || !carSpeed) {
      res.status(500).send({
        erro: "Todos os campos devem ser preenchidos!",
      });
    } else {
      await pool.query(
        "INSERT INTO heroes (name, strength, healthPoints, carSpeed) VALUES ($1, $2, $3, $4)",
        [name, strength, healthPoints, carSpeed]
      );
      res.status(201).send({
        mensagem: `Novo herói foi adicionado a lista com sucesso!`,
      });
    }
  } catch (error) {
    console.error("Erro ao adicionar novo herói", error);
    res.status(500).send("Erro ao adicionar novo herói");
  }
});

app.put("/heroes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, strength, healthPoints, carSpeed } = req.body;

    const result = await pool.query("SELECT * FROM heroes WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res
        .status(404)
        .send({
          mensagem: `Herói de ID: ${id} não encontrado! Tente novamente.`,
        });
    } else {
      await pool.query(
        "UPDATE heroes SET name = $1, strength = $2, healthPoints = $3, carSpeed = $4 WHERE id = $5",
        [name, strength, healthPoints, carSpeed, id]
      );
      res.status(200).send({ mensagem: `Herói foi alterado com sucesso!` });
    }
  } catch (error) {
    console.error("Erro ao atualizar herói:", error);
    res.status(500).send("Erro ao atualizar herói");
  }
});

app.delete("/heroes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM heroes WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res
        .status(404)
        .send({
          mensagem: `Herói de ID: ${id} não encontrado! Tente novamente.`,
        });
    } else {
      await pool.query("DELETE FROM heroes WHERE id = $1", [id]);
      res
        .status(200)
        .send({
          mensagem: `Herói de id:${id} foi deletado da lista com sucesso!`,
        });
    }
  } catch (error) {
    console.error("Erro ao excluir herói:", error);
    res.status(500).send("Erro ao excluir herói");
  }
});

app.get("/heroes/name/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const result = await pool.query(
      `SELECT * FROM heroes WHERE name LIKE '%${name}%'`
    );
    if (result.rowCount === 0) {
      res
        .status(404)
        .send({ mensagem: `Herói não encontrado! Tente novamente.` });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Erro ao obter herói por nome.", error);
    res.status(500).send("Erro ao obter herói por nome.");
  }
});

async function ganhador(hero1, hero2) {
  const poderHero1 = (hero1.strength + hero1.healthpoints) / 2;
  const poderHero2 = (hero2.strength + hero2.healthpoints) / 2;
  console.log("1", hero1.carspeed);
  console.log("2", hero2.carspeed);

  if (poderHero1 > poderHero2) {
    return hero1;
  } else if (poderHero1 < poderHero2) {
    return hero2;
  } else {
    if (hero1.carspeed > hero2.carspeed) {
      return hero1;
    } else if (hero1.carspeed < hero2.carspeed) {
      return hero2;
    } else {
       return null 
    }
  }
}

app.get("/heroes/:hero1id/:hero2id", async (req, res) => {
  try {
    const { hero1id, hero2id } = req.params;

    let hero1 = (
      await pool.query(`SELECT * FROM heroes WHERE id = $1`, [hero1id])
    ).rows[0];
    let hero2 = (
      await pool.query(`SELECT * FROM heroes WHERE id = $1`, [hero2id])
    ).rows[0];

    const winner = await ganhador(hero1, hero2);

    await pool.query('INSERT INTO batalhas (hero1ID, hero2ID, winner) VALUES ($1, $2, $3)', [hero1id, hero2id, winner.id]);

    res.json({ 
        messagem: `O ganhador é ${winner.name}`,
        winner: winner });
  } catch (error) {
    console.error("Erro ao batalhar", error);
    res.status(500).send("Erro ao batalhar");
  }
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
