import { Router } from 'express';
import {
  createPortfolioItem,
  createService,
  createTestimonial,
  deletePortfolioItem,
  deleteService,
  deleteTestimonial,
  getHomepage,
  getPortfolio,
  getServices,
  getTestimonials,
  updateHomepage,
  updatePortfolioItem,
  updateService,
  updateTestimonial
} from '../controllers/resources.js';

export function createResourcesRouter(requireAccess) {
  const router = Router();

  router.get('/services', requireAccess, getServices);
  router.post('/services', requireAccess, createService);
  router.put('/services/:id', requireAccess, updateService);
  router.delete('/services/:id', requireAccess, deleteService);

  router.get('/portfolio', requireAccess, getPortfolio);
  router.post('/portfolio', requireAccess, createPortfolioItem);
  router.put('/portfolio/:id', requireAccess, updatePortfolioItem);
  router.delete('/portfolio/:id', requireAccess, deletePortfolioItem);

  router.get('/testimonials', requireAccess, getTestimonials);
  router.post('/testimonials', requireAccess, createTestimonial);
  router.put('/testimonials/:id', requireAccess, updateTestimonial);
  router.delete('/testimonials/:id', requireAccess, deleteTestimonial);

  router.get('/homepage', requireAccess, getHomepage);
  router.put('/homepage', requireAccess, updateHomepage);

  return router;
}
