import { createClient } from '@supabase/supabase-js';
import { createRepository } from './repository.js';
import { createApp } from './app.js';

const { SUPABASE_URL, SUPABASE_SECRET_KEY, FRONTEND_ORIGIN = 'http://localhost:5173', PORT = '3001' } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Faltan SUPABASE_URL y/o SUPABASE_SECRET_KEY. Copiá .env.example a .env y configurá Supabase.');
  process.exit(1);
}
if (!/^https?:\/\//.test(SUPABASE_URL) || !Number.isInteger(Number(PORT)) || Number(PORT) < 1 || Number(PORT) > 65535) {
  console.error('Revisá SUPABASE_URL y PORT en .env.');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15000) }) },
});
const server = createApp(createRepository(supabase), { frontendOrigin: FRONTEND_ORIGIN })
  .listen(Number(PORT), () => console.log(`API de turnera disponible en http://localhost:${PORT}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
