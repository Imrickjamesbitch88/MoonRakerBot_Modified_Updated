// src/components/GetBalance.tsx
import React, { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import Cookies from 'js-cookie';

const GetBalance = ({ publicKey }: { publicKey: string }) => {
  const [balance, setBalance] = useState('');

  const checkBalance = async () => {
    try {
      const rpcEndpoint = Cookies.get('SOLANA_RPC_ENDPOINT') || 'https://api.mainnet-beta.solana.com';
      const connection = new Connection(rpcEndpoint);
      const pubKey = new PublicKey(publicKey);
      const balance = await connection.getBalance(pubKey);
      setBalance((balance / 1e9).toString()); // Convert lamports to SOL
    } catch (error) {
      console.error('Error checking balance:', error);
      const errorMessage = (error as Error).message;
      alert(`Failed to get balance: ${errorMessage}`);
    }
  };

  return (
    <div className="form-group">
      <button onClick={checkBalance} className="wallet-manager-button">Check Balance</button>
      {balance && (
        <div className="balance">
          <p><strong>Balance:</strong> {balance} SOL</p>
        </div>
      )}
    </div>
  );
};

export default GetBalance;
