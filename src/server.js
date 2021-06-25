// Copyright (C) 2020 Zilliqa

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https:www.gnu.org/licenses/>.

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
