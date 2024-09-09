import React from 'react'; // Ensure React is imported
import { AppProps } from 'next/app';
import '../styles/App.css'; // Import the global CSS file

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
