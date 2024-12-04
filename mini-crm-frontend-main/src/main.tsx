import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "./components/ui/toaster.tsx";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk publishable key to the .env.local file");
}

const signInFallbackRedirectUrl = import.meta.env
  .VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL as string;
const signUpFallbackRedirectUrl = import.meta.env
  .VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL as string;
const signInForceRedirectUrl = import.meta.env
  .VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL as string;
const signUpForceRedirectUrl = import.meta.env
  .VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL as string;
const signInUrl = import.meta.env.VITE_SIGN_IN_URL as string;
const signUpUrl = import.meta.env.VITE_SIGN_UP_URL as string;

if(!signInFallbackRedirectUrl || !signUpFallbackRedirectUrl || !signInForceRedirectUrl || !signUpForceRedirectUrl || !signInUrl || !signUpUrl) {
  throw new Error("Add your Clerk redirect URLs to the .env.local file");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerDebug={process.env.NODE_ENV === "development"}
      signInFallbackRedirectUrl={signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={signUpFallbackRedirectUrl}
      afterSignOutUrl={signInUrl}
      signInForceRedirectUrl={signInForceRedirectUrl}
      signUpForceRedirectUrl={signUpForceRedirectUrl}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
    >
      <App />
      <Toaster />
    </ClerkProvider>
  </React.StrictMode>
);
