import express, { Express } from 'express';
import routes from './routes/routes';

const app: Express = express();
const port = 3000;

// import routes
app.use(routes);

// handle all routes not found
app.use((req: express.Request, res: express.Response): void => {
  res.status(404).send('404 Not Found');
});

app.listen(port, (): void => {
  console.log(`Server listening on port ${port}`);
});
