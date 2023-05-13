import express from "express";
import cors from "cors";
import { writeFile, readFile } from "node:fs/promises";
import { v4 as uuid } from "uuid";

const PORT = 5000;
const DB = "./Data/data.json";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/accounts", async (req, res) => {
  try {
    const data = await readFile(DB, "utf-8");
    const accounts = JSON.parse(data);
    res.json({
      message: "OK",
      accounts,
    });
  } catch (err) {
    res.json({
      message: "failure",
      accounts: null,
    });
  }
});

app.post("/accounts", async (req, res) => {
  try {
    // throw new Error();
    let data = await readFile(DB, "utf-8");
    data = JSON.parse(data);
    const id = uuid();
    const account = { ...req.body.account, id };
    data.push(account);
    data = JSON.stringify(data);
    await writeFile(DB, data);
    res.json({
      message: "OK",
      promiseId: req.body.promiseId,
      id,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "failure",
      promiseId: req.body.promiseId,
    });
  }
});

app.put("/accounts/:id", async (req, res) => {
  try {
    // throw new Error();
    let data = await readFile(DB, "utf-8");
    data = JSON.parse(data);
    data = data.map((account) => (account.id === req.params.id ? { ...account, ...req.body.account } : { ...account }));
    data = JSON.stringify(data);
    await writeFile(DB, data);
    res.json({
      message: "OK",
      promiseId: req.body.promiseId,
      id: req.body.account.id,
    });
  } catch (err) {
    res.json({
      message: "failure",
      promiseId: req.body.promiseId,
      id: req.body.account.id,
    });
  }
});

app.delete("/accounts/:id", async (req, res) => {
  try {
    // throw new Error();
    let data = await readFile(DB, "utf-8");
    data = JSON.parse(data);
    data = data.filter((account) => account.id !== req.params.id);
    data = JSON.stringify(data);
    await writeFile(DB, data);
    res.json({
      message: "OK",
    });
  } catch (err) {
    res.json({
      message: "failure",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Bank U2 server is running on port ${PORT}`);
});
