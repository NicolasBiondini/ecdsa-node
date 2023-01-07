import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import server from "./server";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privKey = evt.target.value;
    setPrivateKey(privKey);

    try {
      const address = toHex(secp.getPublicKey(privKey));
      console.log(address);
      setAddress(address);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      console.log(balance);
      setBalance(balance);
    } catch (error) {
      setBalance(0);
      setAddress("");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type your private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      {address !== "" && (
        <label>
          Public Key
          <span>{address.slice(0, 10)}...</span>
        </label>
      )}

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
