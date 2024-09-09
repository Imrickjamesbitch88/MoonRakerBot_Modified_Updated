import React from 'react';
import { Keypair } from '@solana/web3.js';
import Cookies from 'js-cookie';
import bs58 from 'bs58';

const CreateWallet = ({ setPublicKey, setPrivateKey }: { setPublicKey: (key: string) => void, setPrivateKey: (key: string) => void }) => {
  const createWallet = () => {
    const newWallet = Keypair.generate();
    const publicKey = newWallet.publicKey.toBase58();

    // Convert the secret key to a Base58 string
    const privateKeyBase58 = bs58.encode(newWallet.secretKey);

    setPublicKey(publicKey);
    setPrivateKey(privateKeyBase58);

    // Store the public key in cookies
    Cookies.set('PUBLIC_KEY', publicKey);

    console.log('New Wallet Created:', {
      publicKey,
      privateKey: privateKeyBase58,
    });
  };

  return (
    <div className="form-group">
      <button onClick={createWallet} className="wallet-manager-button">Create Wallet</button>
    </div>
  );
};

export default CreateWallet;
