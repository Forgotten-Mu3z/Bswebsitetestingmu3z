// Use after `npm run build` when testing the compiled Worker locally.
// Start Wrangler on 127.0.0.1:3001 first. Reuse the official Sites local sign-in
// middleware; it strips spoofed identity headers before forwarding requests.
import { createServer } from 'vite';
import { sites } from '@openai/sites-vite-plugin';
const server = await createServer({
  configFile: false,
  plugins: [sites()],
  server: { host: 'localhost', port: 3000, strictPort: true, proxy: { '/': { target: 'http://127.0.0.1:3001', changeOrigin: false } } },
});
await server.listen();
server.printUrls();
