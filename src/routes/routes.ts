import { Request, Response, Router } from 'express';
import { PackagistService } from '../services/packagist.service';
import { CardService } from '../services/card.service';

class MainRouter {
  private packagistService: PackagistService;
  private cardService: CardService;

  constructor() {
    this.packagistService = new PackagistService();
    this.cardService = new CardService();
  }

  public getRouter(): Router {
    const router: Router = Router();

    // main route
    router.get('/api/packagist/card', async (req: Request, res: Response) => {
      const vendor: string | null = (req.query.vendor as string) ?? null;
      const maintainer: string | null =
        (req.query.maintainer as string) ?? null;
      const theme: string | null = (req.query.theme as string) ?? null;

      // throw error if vendor is missing
      if (!vendor) {
        return res.status(400).send('No vendor was given in the request.');
      }

      // check if the response is already cached
      if (req.headers['x-vercel-cache'] === 'HIT') {
        res.status(304).send();
        return;
      }

      const packagistData = await this.packagistService.getPackagistData(
        vendor,
        maintainer
      );

      if (!packagistData) {
        return res
          .status(400)
          .send(
            'Could not find packages for the given vendor or the fetch request failed.'
          );
      }

      // set cache control headers for successful response (2 hours)
      res.set('Cache-Control', 'public, max-age=7200');
      res.set('Content-Type', 'image/svg+xml');
      res.send(
        this.cardService.createCard(packagistData, vendor, maintainer, theme)
      );
    });
    return router;
  }
}

export default new MainRouter().getRouter();
