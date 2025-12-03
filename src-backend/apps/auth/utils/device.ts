import { IRequest } from 'itty-router';

/**
 * Extract device information from request
 */
export function extractDeviceInfo(request: IRequest): {
	ip: string;
	ua: string;
	device: string;
} {
	// Get IP address from Cloudflare headers
	const ip =
		request.headers.get('CF-Connecting-IP') ||
		request.headers.get('X-Forwarded-For')?.split(',')[0] ||
		request.headers.get('X-Real-IP') ||
		'unknown';

	// Get User Agent
	const ua = request.headers.get('User-Agent') || 'unknown';

	// Parse device from User Agent (simplified)
	const device = parseDeviceFromUA(ua);

	return { ip, ua, device };
}

/**
 * Parse device name from User Agent string
 */
function parseDeviceFromUA(ua: string): string {
	if (!ua || ua === 'unknown') {
		return 'Unknown Device';
	}

	// Mobile devices
	if (/iPhone/i.test(ua)) {
		const match = ua.match(/iPhone\s+(\d+)/);
		if (match) {
			return `iPhone ${match[1]}`;
		}
		return 'iPhone';
	}
	if (/iPad/i.test(ua)) {
		return 'iPad';
	}
	if (/Android/i.test(ua)) {
		const match = ua.match(/Android.*?;\s*([^)]+)\)/);
		if (match) {
			return match[1].trim();
		}
		return 'Android Device';
	}

	// Desktop browsers
	if (/Windows/i.test(ua)) {
		if (/Chrome/i.test(ua)) {
			return 'Windows Chrome';
		}
		if (/Firefox/i.test(ua)) {
			return 'Windows Firefox';
		}
		if (/Edge/i.test(ua)) {
			return 'Windows Edge';
		}
		return 'Windows';
	}
	if (/Macintosh/i.test(ua)) {
		if (/Chrome/i.test(ua)) {
			return 'Mac Chrome';
		}
		if (/Safari/i.test(ua)) {
			return 'Mac Safari';
		}
		return 'Mac';
	}
	if (/Linux/i.test(ua)) {
		return 'Linux';
	}

	return 'Unknown Device';
}
