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
        const log = `${id} ${time} ${name}\n`;
        writeData(log);
        return id
    } catch (err) { 
        console.error(err);
    }
}

function parseLogLine(line) {
    const [id, time, name] = line.split(" ");
    return { id, time, name };
}
function parseLines(string) {
    const lines = string.split("\n");
    const logs = []
    for (const line of lines) {
        if (line) {
            const log = parseLogLine(line);
            logs.push(log);
        }
    }
    return logs;
}


async function getAllLogs() {
    return readData().then((data) => {
        const logs = parseLines(data);
        return logs;
    }).catch((err) => {
        console.error(err);
    });
}

async function logSearch(id){
    const logs = getAllLogs();
    logs.then((logs) => {
        const log = logs.find(log => log.id === id);
        console.log(log)
    })
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

const logs = logSearch("01673575-8f28-457f-9dc4-12f9d7160908");
console.log(logs)