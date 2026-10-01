import express from 'express';
import cors from 'cors';
import { HttpError } from './errors.js';
import { parse, createSchema, updateSchema, commentSchema, idSchema, querySchema } from './validation.js';

export function createApp(repository, { frontendOrigin = 'http://localhost:5173', logger = console } = {}) {
  const app = express();
  app.disable('x-powered-by');
  const frontendUrl = new URL(frontendOrigin);
  const allowedOrigins = [frontendUrl.origin];
  // Vite puede abrirse con cualquiera de los dos nombres de loopback.
  // Conservar protocolo y puerto; los dominios externos siguen siendo exactos.
  if (frontendUrl.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(frontendUrl.hostname)) {
    frontendUrl.hostname = frontendUrl.hostname === 'localhost' ? '127.0.0.1' : 'localhost';
    allowedOrigins.push(frontendUrl.origin);
  }
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: '32kb' }));
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.get('/api/pedidos', async (req, res) => {
    const { solapa } = parse(querySchema, req.query);
    res.json({ pedidos: await repository.list(solapa) });
  });
  app.post('/api/pedidos', async (req, res) => {
    const pedido = await repository.create(parse(createSchema, req.body));
    res.status(201).location(`/api/pedidos/${pedido.id}`).json({ pedido });
  });
  app.get('/api/pedidos/:id', async (req, res) => {
    const id = parse(idSchema, req.params.id);
    const pedido = await repository.get(id);
    res.json({ pedido, comentarios: await repository.comments(id) });
  });
  app.patch('/api/pedidos/:id', async (req, res) => {
    const id = parse(idSchema, req.params.id);
    res.json({ pedido: await repository.update(id, parse(updateSchema, req.body)) });
  });
  app.post('/api/pedidos/:id/comentarios', async (req, res) => {
    const id = parse(idSchema, req.params.id);
    const values = parse(commentSchema, req.body);
    await repository.get(id);
    res.status(201).json({ comentario: await repository.addComment(id, values) });
  });
  app.use((_req, _res, next) => next(new HttpError(404, 'La ruta no existe.')));
  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.parse.failed') error = new HttpError(400, 'El cuerpo debe contener JSON válido.');
    if (error.type === 'entity.too.large') error = new HttpError(413, 'El contenido enviado es demasiado grande.');
    if (!(error instanceof HttpError)) {
      logger.error('Error inesperado en la API:', error.message);
      error = new HttpError(500, 'Ocurrió un error inesperado. Intentá nuevamente.');
    }
    res.status(error.status).json({ error: { message: error.message, ...(error.details && { details: error.details }) } });
  });
  return app;
}
