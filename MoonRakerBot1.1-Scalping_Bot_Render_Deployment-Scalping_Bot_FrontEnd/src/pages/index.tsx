import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import Cookies from 'js-cookie';
import CookieConsent from '../components/CookieConsent';
import CreateWallet from '../components/CreateWallet';
import GetBalance from '../components/GetBalance';
import Withdraw from '../components/Withdraw';
import axios from 'axios';

interface EnvVariables {
  SOLANA_RPC_ENDPOINT: string;
  PRIVATE_KEY: string;
  YOURTOKEN_MINT_ADDRESS: string;
  PROFIT_WALLET: string;
}

const Home = () => {
  const router = useRouter(); // Initialize router
  const [envVariables, setEnvVariables] = useState<EnvVariables>({
    SOLANA_RPC_ENDPOINT: process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || '',
    PRIVATE_KEY: process.env.NEXT_PUBLIC_PRIVATE_KEY || '',
    YOURTOKEN_MINT_ADDRESS: process.env.NEXT_PUBLIC_YOURTOKEN_MINT_ADDRESS || '',
    PROFIT_WALLET: process.env.NEXT_PUBLIC_PROFIT_WALLET || ''
  });

  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [walletManagerOpen, setWalletManagerOpen] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [logFeed, setLogFeed] = useState<string[]>([]);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [tradingEnabled, setTradingEnabled] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:10001';
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const consent = Cookies.get('cookies-consent');
    if (consent === 'true') {
      setCookiesAccepted(true);
    }

    const termsConsent = Cookies.get('terms-consent');
    if (termsConsent === 'true') {
      setTermsAccepted(true);
    }

    if (consent === 'true' && termsConsent === 'true') {
      const solanaRpcEndpoint = Cookies.get('SOLANA_RPC_ENDPOINT') || process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT;
      const privateKey = Cookies.get('PRIVATE_KEY') || process.env.NEXT_PUBLIC_PRIVATE_KEY;
      const yourTokenMintAddress = Cookies.get('YOURTOKEN_MINT_ADDRESS') || process.env.NEXT_PUBLIC_YOURTOKEN_MINT_ADDRESS;
      const profitWallet = Cookies.get('PROFIT_WALLET') || process.env.NEXT_PUBLIC_PROFIT_WALLET;
      const publicKey = Cookies.get('PUBLIC_KEY') || '';
      const tradingEnabled = Cookies.get('ENABLE_TRADING') === 'true';

      setEnvVariables({
        SOLANA_RPC_ENDPOINT: solanaRpcEndpoint || '',
        PRIVATE_KEY: privateKey || '',
        YOURTOKEN_MINT_ADDRESS: yourTokenMintAddress || '',
        PROFIT_WALLET: profitWallet || ''
      });
      setPublicKey(publicKey);
      setTradingEnabled(tradingEnabled);
    }
  }, []);

  useEffect(() => {
    if (consoleOpen) {
      const fetchLogs = async () => {
        try {
          const userId = Cookies.get('PUBLIC_KEY');
          if (!userId) {
            console.error('User ID not found in cookies');
            return;
          }

          const response = await axios.get('/api/get-logs', {
            params: { userId },
          });

          setLogFeed(response.data.logs || []);
        } catch (error) {
          console.error('Error fetching logs:', error);
        }
      };

      const interval = setInterval(() => {
        fetchLogs();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [consoleOpen]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logFeed]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEnvVariables((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = {
        SOLANA_RPC_ENDPOINT: envVariables.SOLANA_RPC_ENDPOINT,
        PRIVATE_KEY: envVariables.PRIVATE_KEY,
        YOURTOKEN_MINT_ADDRESS: envVariables.YOURTOKEN_MINT_ADDRESS,
        PROFIT_WALLET: envVariables.PROFIT_WALLET,
        PUBLIC_KEY: publicKey,
        ENABLE_TRADING: tradingEnabled.toString()
      };

      console.log('Updating config with:', config);

      await axios.post('/api/update-config', config);

      Cookies.set('SOLANA_RPC_ENDPOINT', envVariables.SOLANA_RPC_ENDPOINT);
      Cookies.set('PRIVATE_KEY', envVariables.PRIVATE_KEY);
      Cookies.set('YOURTOKEN_MINT_ADDRESS', envVariables.YOURTOKEN_MINT_ADDRESS);
      Cookies.set('PROFIT_WALLET', envVariables.PROFIT_WALLET);
      Cookies.set('PUBLIC_KEY', publicKey);
      Cookies.set('ENABLE_TRADING', tradingEnabled.toString());

      alert('Environment variables updated successfully');
    } catch (error) {
      console.error('Error updating environment variables:', error);
      alert('Failed to update environment variables');
    }
  };

  const toggleTrading = async () => {
    try {
      const userId = Cookies.get('PUBLIC_KEY');
      if (!userId) {
        throw new Error('User ID not found in cookies');
      }

      const newTradingState = !tradingEnabled;

      console.log(`Toggling trading for userId: ${userId}, enable: ${newTradingState}`);

      await axios.post('/api/toggle-trading', { userId, enable: newTradingState });
      setTradingEnabled(newTradingState);
      Cookies.set('ENABLE_TRADING', newTradingState.toString());
      alert(`Trading ${newTradingState ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error(`Error ${tradingEnabled ? 'disabling' : 'enabling'} trading:`, error);
      alert(`Failed to ${tradingEnabled ? 'disable' : 'enable'} trading`);
    }
  };

  const startTrading = async () => {
    try {
      const userId = Cookies.get('PUBLIC_KEY');
      if (!userId) {
        throw new Error('User ID not found in cookies');
      }

      console.log('Starting trading for userId:', userId);
      setConsoleOpen(true);

      alert('Trading started successfully');

      await axios.post(`${backendUrl}/api/start-trading`, { userId });

    } catch (error) {
      console.error('Error starting trading:', error);
      alert('Failed to start trading');
    }
  };

  const stopTrading = async () => {
    try {
      const userId = Cookies.get('PUBLIC_KEY');
      if (!userId) {
        throw new Error('User ID not found in cookies');
      }

      console.log('Stopping trading for userId:', userId);

      await axios.post('/api/stop-trading');

      // Set trading state to false in the UI
      setTradingEnabled(false);
      Cookies.set('ENABLE_TRADING', 'false');

      alert('Trading stopped successfully');
    } catch (error) {
      console.error('Error stopping trading:', error);
      alert('Failed to stop trading');
    }
  };

  const clearCookies = () => {
    Cookies.remove('SOLANA_RPC_ENDPOINT');
    Cookies.remove('PRIVATE_KEY');
    Cookies.remove('YOURTOKEN_MINT_ADDRESS');
    Cookies.remove('PROFIT_WALLET');
    Cookies.remove('PUBLIC_KEY');
    Cookies.remove('cookies-consent');
    Cookies.remove('ENABLE_TRADING');
    Cookies.remove('terms-consent');
    setEnvVariables({
      SOLANA_RPC_ENDPOINT: process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || '',
      PRIVATE_KEY: process.env.NEXT_PUBLIC_PRIVATE_KEY || '',
      YOURTOKEN_MINT_ADDRESS: process.env.NEXT_PUBLIC_YOURTOKEN_MINT_ADDRESS || '',
      PROFIT_WALLET: process.env.NEXT_PUBLIC_PROFIT_WALLET || ''
    });
    setPublicKey('');
    setPrivateKey('');
    setCookiesAccepted(false);
    setTermsAccepted(false);
    setTradingEnabled(false);
    alert('Cookies cleared successfully');
  };

  const handleAcceptCookies = () => {
    Cookies.set('cookies-consent', 'true', { expires: 365 });
    setCookiesAccepted(true);
  };

  const handleAcceptTerms = () => {
    Cookies.set('terms-consent', 'true', { expires: 365 });
    setTermsAccepted(true);
  };

  const handleDisagreeTerms = () => {
    window.location.href = 'https://www.moonrakerbot.com';
  };

  const openDexScreener = () => {
    const url = `https://dexscreener.com/solana/${envVariables.YOURTOKEN_MINT_ADDRESS}`;
    window.open(url, '_blank');
  };

  const openRugCheck = () => {
    const url = `https://rugcheck.xyz`;
    window.open(url, '_blank');
  };

  const openCharteye = () => {
    const url = `https://charteye.ai`;
    window.open(url, '_blank');
  };

  const refreshLogs = async () => {
    try {
      const userId = Cookies.get('PUBLIC_KEY');
      if (!userId) {
        console.error('User ID not found in cookies');
        return;
      }

      const response = await axios.get('/api/get-logs', {
        params: { userId },
      });

      setLogFeed(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {!termsAccepted && (
          <div className="modal">
            <div className="modal-content">
              <p>By using MoonRaker bots, you agree to our terms and conditions available on the <a href="https://moonrakerbot.com/terms-conditions/" target="_blank">MoonRaker website</a>.</p>
              <button onClick={handleAcceptTerms}>Agree</button>
              <button onClick={handleDisagreeTerms}>Disagree</button>
            </div>
          </div>
        )}
        {termsAccepted && cookiesAccepted ? (
          <>
            <div className="header-buttons">
              <button className="left-button" onClick={() => window.location.href = 'https://www.moonrakerbot.com/services'}>Choose Another Bot</button>
              <button className="right-button" onClick={() => window.location.href = 'https://www.moonrakerbot.com'}>Exit App</button>
            </div>
            
            {/* New Backtest Button */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <button onClick={() => router.push('/backtest')} className="backtest-button">
                Go to Backtest Page
              </button>
            </div>
            
            <img src="/solana-logo.png" className="App-logo" alt="Logo" />
            <h1>Update the Fields below, hit the update Button, then click Enable to Start Trading... LFG!</h1>
            <form onSubmit={handleSubmit} className="env-form">
              <div className="env-input">
                <label>Solana RPC Endpoint:</label>
                <input type="text" name="SOLANA_RPC_ENDPOINT" value={envVariables.SOLANA_RPC_ENDPOINT} onChange={handleChange} />
              </div>
              <div className="env-input">
                <label>Private Key:</label>
                <input type="text" name="PRIVATE_KEY" value={envVariables.PRIVATE_KEY} onChange={handleChange} />
              </div>
              <div className="env-input">
                <label>Your Token Mint Address:</label>
                <input type="text" name="YOURTOKEN_MINT_ADDRESS" value={envVariables.YOURTOKEN_MINT_ADDRESS} onChange={handleChange} />
              </div>
              <div className="env-input">
                <label>Profit Wallet Address:</label>
                <input type="text" name="PROFIT_WALLET" value={envVariables.PROFIT_WALLET} onChange={handleChange} />
              </div>
              <button
                type="submit"
                className="update-button"
                style={{ margin: '10px 0' }}
              >
                Update
              </button>
              <button
                type="button"
                onClick={toggleTrading}
                className={`trading-toggle ${tradingEnabled ? 'enabled' : 'disabled'}`}
                style={{ margin: '10px' }}
              >
                {tradingEnabled ? 'Disable Trading' : 'Enable Trading'}
              </button>
              <div
                className={`trading-status-light ${tradingEnabled ? 'green-light' : 'red-light'}`}
                style={{ marginLeft: '10px' }}
              />
              <div className="status-lights">
                <div className={`status-light ${tradingEnabled ? 'green-light' : 'red-light'}`}></div>
                <div className={`status-light ${tradingEnabled ? 'green-light' : 'red-light'}`}></div>
                <div className={`status-light ${tradingEnabled ? 'green-light' : 'red-light'}`}></div>
                <div className={`status-light ${tradingEnabled ? 'green-light' : 'red-light'}`}></div>
              </div>
            </form>
            <div className="button-group">
              <button onClick={startTrading} className="trading-button">Start Trading</button>
              <button onClick={stopTrading} className="trading-button">Stop Trading</button>
              <button onClick={() => setWalletManagerOpen(!walletManagerOpen)} className="wallet-manager-toggle" title="Click here to create a new wallet and obtain your keys for trading.">
                {walletManagerOpen ? 'Hide Wallet Manager' : 'Show Wallet Manager'}
              </button>
              <button onClick={openDexScreener} className="chart-toggle opendexscreener-button" title="Opens DEXscreener with your current token Data. Be sure to add the Charteye AI extension for extra functionality and pick a winner straight out of the Gate!">
                DEX Screener
              </button>
              <button onClick={openRugCheck} className="chart-toggle rugcheck-button" title="Risk Management for your token.">
                RugCheck
              </button>
              <button onClick={() => setConsoleOpen(!consoleOpen)} className="console-toggle" title="Real time Back End Data.">
                {consoleOpen ? 'Hide Console' : 'Show Console'}
              </button>
              <button onClick={openCharteye} className="chart-toggle charteye-button" title="Add the Charteye.ai Chart Analyzer chrome extension to your browser to supercharge and simplify your technical analysis for tokens on DEX Screener.">
                Charteye AI
              </button>
              <button onClick={clearCookies} className="clear-cookies-button" title="Clears cache and personal information. Private key is only stored in your cookies and does not leave your environment. Public wallet address is used for backend transactions.">
                Clear Cookies
              </button>
            </div>
            {walletManagerOpen && (
              <div className="wallet-manager">
                <h2>Solana Wallet Manager</h2>
                <CreateWallet setPublicKey={setPublicKey} setPrivateKey={setPrivateKey} />
                {privateKey && (
                  <div>
                    <p><strong>Private Key:</strong> {privateKey}</p>
                    <p><strong>Public Key:</strong> {publicKey}</p>
                    <button onClick={() => navigator.clipboard.writeText(privateKey)}>Copy Private Key to Clipboard</button>
                    <div className="warning">
                      WARNING! COPY AND PASTE YOUR ABOVE PRIVATE KEY INTO A 
                      <a className="link" href="https://help.phantom.app/hc/en-us/articles/15079894392851-Importing-an-Existing-Wallet-into-Phantom" target="_blank">NEW PHANTOM WALLET</a> ACCOUNT. IF YOU FAIL TO DO SO YOU MAY LOSE ACCESS TO YOUR FUND.
                    </div>
                  </div>
                )}
                <Withdraw privateKey={privateKey} />
                <GetBalance publicKey={publicKey} />
              </div>
            )}
            {consoleOpen && (
              <div className="console">
                <h2>Console</h2>
                <button onClick={refreshLogs}>Refresh Logs</button>
                <div className="log-feed">
                  {logFeed.length > 0 ? (
                    logFeed.map((log, index) => (
                      <p key={index}>{log}</p>
                    ))
                  ) : (
                    <p>No logs available</p>
                  )}
                  <div ref={logEndRef}></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <CookieConsent onAccept={handleAcceptCookies} />
        )}
      </header>
    </div>
  );
};

export default Home;
