// src/api/solana.ts

import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';

// You can replace the endpoint with your own RPC endpoint or use an environment variable.
const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

// Create a connection to the Solana blockchain
const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');

/**
 * Fetch historical price data from an external API or blockchain data provider.
 * @param startDate - The start date for fetching historical data.
 * @param endDate - The end date for fetching historical data.
 * @returns A promise that resolves to an array of historical data points.
 */
export async function fetchHistoricalData(startDate: string, endDate: string) {
  try {
    // Example: Replace with your own API or method for fetching historical data
    const response = await axios.get('https://example-data-provider.com/solana/history', {
      params: {
        start: startDate,
        end: endDate,
      },
    });

    if (response.status === 200) {
      return response.data; // Assuming the API returns an array of historical data points
    } else {
      console.error(`Error fetching historical data: ${response.statusText}`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
}

/**
 * Get the current balance of a given wallet address.
 * @param walletAddress - The public key of the wallet to check the balance of.
 * @returns A promise that resolves to the balance in lamports.
 */
export async function getBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
}

/**
 * Get the token balance for a specific token mint and wallet address.
 * @param walletAddress - The public key of the wallet.
 * @param tokenMintAddress - The public key of the token mint.
 * @returns A promise that resolves to the token balance in the smallest unit of the token (usually lamports).
 */
export async function getTokenBalance(walletAddress: string, tokenMintAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const tokenMint = new PublicKey(tokenMintAddress);
    const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, { mint: tokenMint });
    const balanceInfo = accounts.value[0]?.account?.data?.parsed?.info?.tokenAmount?.amount || 0;
    return parseInt(balanceInfo, 10);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
}

/**
 * Simulate a transaction for testing purposes.
 * @param transaction - The transaction to simulate.
 * @returns A promise that resolves to the simulation result.
 */
export async function simulateTransaction(transaction: any): Promise<any> {
  try {
    const simulationResult = await connection.simulateTransaction(transaction);
    return simulationResult.value;
  } catch (error) {
    console.error('Error simulating transaction:', error);
    throw error;
  }
}
