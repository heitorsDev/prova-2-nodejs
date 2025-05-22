const express = require("express");
const fs = require("fs").promises;
const uuid = require("uuid");


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
    } catch (err) { 
        console.error(err);
    }
}
createLog("Lucas");

const data = readData();
data.then((data) => {
    console.log(data)
})

