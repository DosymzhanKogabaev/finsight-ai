import { IRequest } from 'itty-router';
import apiRouter from './apps/apiRouter';
import docsRouter from './apps/docsRouter';
import { composeMiddlewares, Middleware } from './middlewareComposer';
import { cdnMiddleware, optionsMiddleware, serveAssetsMiddleware } from './middlewares';
import auth from './middlewares/jwtAuth';

const middlewares: Middleware[] = [optionsMiddleware, cdnMiddleware, serveAssetsMiddleware];

function applyCors(response: Response, request: Request): Response {
	if (request.headers.has('Origin')) {
		const newResponse = new Response(response.body, response);
		newResponse.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin') || '*');

		return newResponse;
	}

	return response;
}

async function serveApi(request: Request, env: Env, ctx: ExecutionContext): Promise<Response | null> {
	const url = new URL(request.url);
	if (url.pathname.startsWith('/docs')) {
		return await docsRouter.fetch(request, env, ctx);
	}

	const response = await apiRouter.fetch(request, env, ctx);
	if (!response) {
		return null;
	}

	return response;
}

async function handleProtectedRoute(request: IRequest, env: Env, ctx: ExecutionContext, handler: Function): Promise<Response> {
	const authResult = await auth(request, env, ctx);

	if (authResult) {
		return authResult;
	}

	const userId = request.user?.user_id;

	if (!userId) {
		return new Response('user id is required', { status: 400 });
	}

	return await handler(request, env, ctx);
}

export default {
	async fetch(request: IRequest, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const handler = await composeMiddlewares(middlewares, serveApi);
			const isPrivateRoute = new URL(request.url).pathname.includes('private');

			const response = isPrivateRoute ? await handleProtectedRoute(request, env, ctx, handler) : await handler(request, env, ctx);

			return applyCors(response || new Response('Not found', { status: 404 }), request);
		} catch (error) {
			console.error(error);

			return new Response('Server error', { status: 500 });
		}
	},
};
