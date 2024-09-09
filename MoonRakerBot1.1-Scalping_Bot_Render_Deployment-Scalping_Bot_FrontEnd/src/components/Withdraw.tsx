// src/components/Withdraw.tsx
import React, { useState } from 'react';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import Cookies from 'js-cookie';

const Withdraw = ({ privateKey }: { privateKey: string }) => {
  const [toPublicKey, setToPublicKey] = useState('');
  const [amount, setAmount] = useState('');

  const sendSol = async () => {
    try {
      const rpcEndpoint = Cookies.get('SOLANA_RPC_ENDPOINT') || 'https://api.mainnet-beta.solana.com';
      const connection = new Connection(rpcEndpoint);
      const fromKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      const toPublicKeyInstance = new PublicKey(toPublicKey);
      const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKeyInstance,
          lamports,
        })
      );

      const signature = await connection.sendTransaction(transaction, [fromKeypair]);
      await connection.confirmTransaction(signature, 'confirmed');
      console.log(`Withdrawn ${amount} SOL to ${toPublicKey}. Transaction signature: ${signature}`);
    } catch (error) {
      console.error('Error sending SOL:', error);
      alert('Failed to send SOL');
    }
  };

  return (
    <div className="form-group">
      <input
        type="text"
        placeholder="Recipient Public Key"
        value={toPublicKey}
        onChange={(e) => setToPublicKey(e.target.value)}
        className="wallet-manager-input"
      />
      <input
        type="text"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="wallet-manager-input"
      />
      <button onClick={sendSol} className="wallet-manager-button">Withdraw</button>
    </div>
  );
};

export default Withdraw;
