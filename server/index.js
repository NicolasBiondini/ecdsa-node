const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0400b8038712cc1df97762e3420d69124fd6ccfa06fa9f679c69190ba178ff953d2cbdbb49731d9205d52278e24b6643031dda84c937d69e7be4e9539681e89881": 100,
  "045dbcb8c40d1d5d842eeacf9e966cffcd7cc07064b3372c1fabbb59b49ca064a785d248a8c3304ce48f655327eac96bbfda9b446681f1d8082a29b0f94ddfb76b": 50,
  "04240964829f740ac28a824ac869016dbd5c8fcbeb3e4d4df0f13d07b1436400900fdcefb2204cbd2ba40d7c8d647af9bb88876e93cb8e85cd2fc9f27193c1b089": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, signature, recovery } = req.body;

  try {
    let sender = toHex(
      secp.recoverPublicKey(
        keccak256(utf8ToBytes(`Alchemy University`)),
        Uint8Array.from(signature),
        recovery
      )
    );
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Wallet doesn't exists" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
