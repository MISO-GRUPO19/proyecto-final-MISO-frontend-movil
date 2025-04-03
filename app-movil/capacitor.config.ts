import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.miempresa.miapp',
  appName: 'MiAppMobile',
  webDir: 'dist/app-movil/browser',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'http', // 👈 cambia el esquema HTTPS a HTTP
    hostname: 'localhost'
  }
};

export default config;
