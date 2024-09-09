# MoonRakerBot Front-End

## MoonRakerBot is a highly dependable trading bot that utilizes leading trading strategies to automate cryptocurrency trading. This backend service is designed to handle multiple users, leveraging Redis for user-specific data storage and Render for scalable deployment

### Overview

The project is structured as follows:

```
├── package.json
├── package-lock.json
├── src
│   ├── api
│   │   ├── jupiter.ts                # Jupiter API client
│   │   └── solana.ts                 # Solana blockchain interaction utilities
│   │
│   ├── backend
│   │   ├── config.ts                 # Configuration management
│   │   ├── loggingService.ts         # Logging service
│   │   ├── main.ts                   # Entry point of the trading logic
│   │   ├── redisApi.ts               # Redis API interaction
│   │   ├── server.ts                 # API server initialization and routes
│   │   └── trading-manager.ts        # Trading process management
│   │
│   ├── pages
│   │   ├── _app.tsx                  # Next.js custom App component
│   │   ├── index.tsx                 # Main page
│   │   ├── api
│   │   │   ├── get-balance.ts        # API route to get balance
│   │   │   ├── get-config.ts         # API route to get config
│   │   │   ├── get-logs.ts           # API route to get logs
│   │   │   ├── is-trading-running.ts # API route to check if trading is running
│   │   │   ├── send-sol.ts           # API route to send SOL
│   │   │   ├── start-trading.ts      # API route to start trading
│   │   │   ├── stop-trading.ts       # API route to stop trading
│   │   │   └── update-config.ts      # API route to update config
│   │
│   ├── strategies
│   │   └── basicMM.ts          # Basic market-making strategy implementation
│   │
│   ├── styles
│   │   └── App.css             # Application CSS
│   │
│   ├── utils
│   │   ├── convert.ts          # Utility functions for token unit conversions
│   │   ├── getSignature.ts     # Utility for transaction signature handling
│   │   └── sleep.ts            # Asynchronous sleep utility
│   │
│   └── wallet.ts               # Wallet and keypair management utilities
└── tsconfig.json
```

### Architecture

#### 1. API Server
Endpoints:
/start-trading: Starts the trading process for a user.
/stop-trading: Stops the trading process for a user.
/is-trading: Checks if the trading process is running for a user.
Scaling: Render automatically scales the API server to handle concurrent requests from multiple users.
#### 2. Trading Logic
Core Logic: Implements the trading strategies.
Process Management: Trading processes are started and stopped via API calls.
Execution: Runs in isolated instances to ensure user-specific trades are executed independently.
#### 3. Redis Integration
User Data Storage: Stores configuration and state data for each user.
Fast Access: Provides quick access to user-specific data for the trading logic.
How It Works
User Interaction:

Users interact with the frontend, making API calls to start or stop trading.
API Server:

The API server, running on Render, receives these requests.
For /start-trading, the server fetches user-specific data from Redis and triggers the trading process.
For /stop-trading, the server updates the user state in Redis and stops the trading process.
Trading Process:

Each trading process runs independently, using the user-specific configurations fetched from Redis.
The processes are managed and scaled automatically by Render.
Redis Integration:

Redis stores and manages user-specific configurations and state data.
Provides fast and efficient access to the required data for each trading instance.
Deployment
Requirements
Node.js
Yarn
Redis
Render account
Setup
Install dependencies:

```bash
yarn install
```
Build the project:

```bash
yarn build
```
Start the API server:

```bash
yarn start
```
Start trading manually (for testing):

```bash
yarn start-trading
```
### Environment Variables
Ensure you have the following environment variables set up:

#### REDIS_URL: URL for the Redis instance.
#### NODE_ENV: Set to production for production environment.

Contributing
Feel free to submit issues and pull requests for new features, bug fixes, and improvements.

License
This project is licensed under the ISC License.

## For more information, visit MoonRakerBot.com
