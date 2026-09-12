import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { URL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        try {
          const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          const routeName = parsedUrl.pathname.replace(/^\/api\/?/, '').split('/')[0];
          if (!routeName) return next();

          const filePath = path.resolve(process.cwd(), 'api', `${routeName}.js`);
          if (!fs.existsSync(filePath)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Not found' }));
          }

          const mod = await server.ssrLoadModule(filePath);
          const handler = mod.default;

          if (typeof handler !== 'function') {
            return next();
          }

          // Parse query
          const query: Record<string, string> = {};
          parsedUrl.searchParams.forEach((val, key) => {
            query[key] = val;
          });
          Object.assign(req, { query });

          // Parse body if needed
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            const raw = Buffer.concat(chunks).toString('utf-8');
            try {
              Object.assign(req, { body: raw ? JSON.parse(raw) : {} });
            } catch {
              Object.assign(req, { body: raw });
            }
          }

          // Enhance response object
          let code = 200;
          const enhancedRes = Object.assign(res, {
            status(statusCode: number) {
              code = statusCode;
              res.statusCode = statusCode;
              return enhancedRes;
            },
            json(data: unknown) {
              res.statusCode = code;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return enhancedRes;
            },
          });

          await handler(req, enhancedRes);
        } catch (err: unknown) {
          console.error(`Error handling ${req.url}:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            const message = err instanceof Error ? err.message : 'Internal server error';
            res.end(JSON.stringify({ error: message }));
          }
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const envAll = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, envAll);

  const plugins = [react(), tailwindcss(), apiDevPlugin()];
  try {
    // @ts-expect-error Optional dev plugin file
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {
    // Optional source tags plugin not loaded
  }

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            icons: ['lucide-react'],
            motion: ['framer-motion'],
          },
        },
      },
    },
  };
})
