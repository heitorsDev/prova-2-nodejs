const express = require("express");
const fs = require("fs").promises;
const uuid = require("uuid");

const app = express();
const port = 3000;
async function readData() {
    try {
        const data = await fs.readFile("./logs.txt", "utf-8");
        return data;
      } catch (err) {
        return { error: err.message };
      }
}

async function writeData(data) {
    try {
        await fs.appendFile("./logs.txt", data);
        return { message: "dados escritos" };
      } catch (err) {
        return { error: err.message };
      }
}

async function createLog(name){
    const time = new Date().toISOString();
    const id = uuid.v4();
    try {
        const log = `${id} ${time} ${name} \n`;
        writeData(log);
        return id
    } catch (err) { 
        console.error(err);
    }
}

app.use(express.json());

app.post("/logs", express.json(), async (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.status(400).json({ error: "nome do usuário obrigatório" });
    }
    try {
        const id = await createLog(name);
        res.status(201).json({ message: "log criado com sucesso", id: id });
    } catch (err) {
        res.status(500).json({ error: "erro ao criar log" });
    }

})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})