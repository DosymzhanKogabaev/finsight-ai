import { NextFunction } from '../middlewareComposer';

const CDN_PREFIX = '/cdn/';

export const cdnMiddleware = async (request: Request, env: Env, ctx: ExecutionContext, next: NextFunction) => {
	const { pathname } = new URL(request.url);

	if (!pathname.startsWith(CDN_PREFIX)) {
		// not a cdn route → pass further
		return next(request, env, ctx);
	}

	const key = decodeURIComponent(pathname.substring(CDN_PREFIX.length));

	// simple protection from ../../
	if (key.includes('..')) {
		return new Response('Bad object key', { status: 400 });
	}

	// support Range
	const rangeHeader = request.headers.get('Range') ?? undefined;
	const object = await env.R2_BUCKET.get(key, { range: rangeHeader });

	if (!object) {
		return new Response('File not found', { status: 404 });
	}

	// ETag/If-None-Match
	const etag = object.httpEtag || object.etag;
	if (etag && request.headers.get('If-None-Match') === etag) {
		return new Response(null, { status: 304, headers: { ETag: etag } });
	}

	const headers = new Headers({
		'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
		'Cache-Control': 'public, max-age=86400',
		ETag: etag,
		'Content-Length': object.size?.toString() ?? '',
		'Content-Disposition': 'inline',
		'Access-Control-Allow-Origin': '*',
	});

	// HEAD – only headers
	if (request.method === 'HEAD') {
		return new Response(null, {
			status: rangeHeader ? 206 : 200,
			headers,
		});
	}

	return new Response(object.body, { headers });
};
