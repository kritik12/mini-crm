/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CLERK_PUBLISHABLE_KEY: string
    readonly VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string
    readonly VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: string
    readonly VITE_CLERK_SIGN_IN_FORCE_URL: string
    readonly VITE_CLERK_SIGN_UP_FORCE_URL: string
    readonly VITE_SIGN_IN_URL: string
    readonly VITE_SIGN_UP_URL: string
    readonly VITE_BACKEND_URL: string
    // add more env variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }