const { log } = require("console");
const express = require("express");
const fs = require("fs").promises;
const uuid = require("uuid");
const { serialize } = require("v8");

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

async function createLog(name) {
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
        return undefined
    });
}

async function logSearch(id) {
    const logs = await getAllLogs();
   try {
        const log = logs.find(log => log.id === id)

        return log;
    }catch{
        console.error(err);
        return undefined
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

app.get("/logs", async (req, res) => {
    try {

        const logs = await getAllLogs();

        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ error: "erro ao buscar logs" });
    }})

app.get("/logs/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const log = logSearch(id);
        log.then((log)=>{
            res.status(200).json(log);
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "erro ao buscar log" })
    }
})



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})
