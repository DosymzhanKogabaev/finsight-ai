export default {
	async fetch(request, env, _ctx): Promise<Response> {
		const url = new URL(request.url);

		// Handle API routes
		switch (url.pathname) {
			case '/message':
				return new Response('Hello, World!');
			case '/random':
				return new Response(crypto.randomUUID());
			default:
				// For all other routes, serve static assets from ASSETS binding
				return env.ASSETS.fetch(request);
		}
	},
} satisfies ExportedHandler<Env>;
//test
