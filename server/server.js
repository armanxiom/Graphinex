import { createApp } from './app.js';

const PORT = Number(process.env.SERVER_PORT ?? 3001);

async function start() {
  const app = await createApp();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Graphinex control server listening on http://127.0.0.1:${PORT}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
