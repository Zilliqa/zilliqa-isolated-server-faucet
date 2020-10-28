import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import Faucet from './faucet';
import cors from 'cors';

require('dotenv').config();

const FAUCET_PORT = process.env.FAUCET_PORT;

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const faucet = new Faucet();

app.post('/register-account', async (req, res) => {
  const address = req.body.address;

  try {
    const date = new Date();
    console.log(`[${date.toUTCString()}] Register address ${address}.`);
    const result = await faucet.registerUser(address);
    faucet.saveState();
    return res.json(result);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.post('/request-funds', async (req, res) => {
  const address = req.body.address;
  const amount = req.body.amount || process.env.ZILS_PER_REQUEST;

  try {
    const date = new Date();
    console.log(
      `[${date.toUTCString()}] Request funds for ${address}. Amount ${amount}`
    );
    const result = await faucet.requestFunds(address, amount);
    faucet.saveState();
    return res.json(result);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.listen(FAUCET_PORT, () => console.log(`Faucet listening on port ${FAUCET_PORT}!`));
