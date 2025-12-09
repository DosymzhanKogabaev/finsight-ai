import { fromIttyRouter } from 'chanfana';
import { Router } from 'itty-router';
import { RouterOpenApiType, RouterTypeItty } from '../types';
import { registerAppRoutes } from './appUrls';

const _router: RouterTypeItty = Router();
const router: RouterOpenApiType = fromIttyRouter(_router);
router.registry.registerComponent('securitySchemes', 'BearerAuth', {
	type: 'http',
	scheme: 'bearer',
	bearerFormat: 'JWT',
	description: 'JWT access token',
});

// Регистрируем все маршруты
registerAppRoutes(router, '/api');
export default router;
