
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App';
import './index.css';

// Clerk publishable key - this is ok to be in code as it's a publishable key
const PUBLISHABLE_KEY = "pk_test_Y2xlcmsuZGV2LmxvdmFibGUuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/"
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/"
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
);
