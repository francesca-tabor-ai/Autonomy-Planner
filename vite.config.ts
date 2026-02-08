import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

// Load API keys from api_keys.env file
function loadApiKeys() {
  try {
    const apiKeysContent = readFileSync('./api_keys.env', 'utf-8');
    const keys: Record<string, string> = {};
    
    apiKeysContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      // Skip comments and empty lines
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          // Remove quotes if present
          keys[key] = value.replace(/^["']|["']$/g, '');
        }
      }
    });
    
    return keys;
  } catch (error) {
    console.warn('Could not load api_keys.env:', error);
    return {};
  }
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiKeys = loadApiKeys();
    
    // Use GOOGLE_API_KEY from api_keys.env, fallback to env.GEMINI_API_KEY or env.GOOGLE_API_KEY
    const geminiApiKey = apiKeys.GOOGLE_API_KEY || apiKeys.GEMINI_API_KEY || env.GEMINI_API_KEY || env.GOOGLE_API_KEY || '';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(geminiApiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
