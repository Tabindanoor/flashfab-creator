
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App';
import './index.css';

// Clerk publishable key - this should start with pk_test_ or pk_live_
// The current key appears to be encoded and not in the correct format
const PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY || "pk_test_Z2VuZXJvdXMtYnVsbC05OS5jbGVyay5hY2NvdW50cy5kZXYk";

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
