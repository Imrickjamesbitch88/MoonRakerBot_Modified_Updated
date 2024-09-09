import { promises as fs } from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');

async function createEnvFile() {
  try {
    const envExists = await fs.access(envPath).then(() => true).catch(() => false);

    if (!envExists) {
      const defaultEnvContent = `
SOLANA_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
PRIVATE_KEY=[YOUR_PRIVATE_KEY]
YOURTOKEN_MINT_ADDRESS=[YOURTOKEN_MINT_ADDRESS]
ENABLE_TRADING=false
UPSTASH_REST_URL=https://evolved-shark-56156.upstash.io
UPSTASH_REST_TOKEN=AdtcAAIjcDFiMjhkZTM3ZTQ1OTE0MzBhYTZiN2IzNmE3YzcxZDRiMHAxMA

`;
await fs.writeFile(envPath, defaultEnvContent.trim(), 'utf-8');
console.log('.env file created successfully.');
} else {
console.log('.env file already exists.');
}
} catch (error) {
console.error('Error creating .env file:', error);
}
}

createEnvFile();