import { JwtPayload } from '@/shared';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { IRequest } from 'itty-router';

// ====================
// Public functions
// ====================

export default async function auth(request: IRequest, env: Env, _ctx: ExecutionContext): Promise<Response | void> {
	const urlPathname = new URL(request.url).pathname;
	if (urlPathname.includes('private')) {
		const token = getJwt(request);
		if (!token) {
			return new Response('No authorization token provided', { status: 401 });
		}

		const result = await verifyJwt(token, env);

		// Check if verifyJwt returned an error Response
		if (result instanceof Response) {
			return result;
		}

		// result is a JwtPayload
		const payload = result as JwtPayload;
		request.user = {
			user_id: payload.user_id,
		};
	}
	// If not a private route, continue without authentication
}

export async function verifyJwt(token: string, env: Env): Promise<Response | JwtPayload> {
	const isValid = await jwt.verify(token, env.JWT_SECRET_TOKEN);
	if (!isValid) {
		return new Response('Invalid JWT signature', { status: 401 });
	}

	const decoded = jwt.decode(token);
	if (!decoded) {
		return new Response('Invalid JWT format', { status: 401 });
	}

	const payload = decoded.payload as JwtPayload;
	if (!payload || !payload?.user_id || !payload?.exp) {
		return new Response('Invalid token payload', { status: 401 });
	}
	if (!checkTokenExpired(payload)) {
		return new Response('Token expired', { status: 401 });
	}

	return payload;
}

// ====================
// Private functions
// ====================

function checkTokenExpired(payload: JwtPayload): boolean {
	const now = Math.floor(Date.now() / 1000);
	if (payload.exp && payload.exp > now) {
		return true;
	}

	return false;
}

function getJwt(request: Request): string | null {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader) return null;

	const [scheme, token] = authHeader.split(' ');
	if (!token) return null;

	const prefix = scheme.toLowerCase();
	if (prefix === 'bearer' || prefix === 'jwt') {
		return token.trim();
	}

	return null;
}
