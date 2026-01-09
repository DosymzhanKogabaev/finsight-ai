import { DurableObject } from 'cloudflare:workers';

export interface RateLimitConfig {
	millisecondsPerRequest: number;
	gracePeriodMs: number;
}

export interface RateLimitResult {
	allowed: boolean;
	retryAfterMs: number;
	limitMs: number; // millisecondsPerRequest for reference
}

const STORAGE_KEY = 'nextAllowedTime';
const DEFAULT_MILLISECONDS_PER_REQUEST = 70;
const DEFAULT_GRACE_PERIOD_MS = 5000;

export class RateLimiter extends DurableObject {
	private nextAllowedTime: number | null = null;
	private stateLoaded: boolean = false;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	/**
	 * Load state from storage (lazy loading on first request)
	 */
	private async loadState(): Promise<void> {
		if (this.stateLoaded) {
			return;
		}

		try {
			const stored = await this.ctx.storage.get<number>(STORAGE_KEY);
			this.nextAllowedTime = stored ?? 0;
		} catch (error) {
			// Fail-open: if storage read fails, allow requests
			console.error('Failed to load rate limiter state:', error);
			this.nextAllowedTime = 0;
		}

		this.stateLoaded = true;
	}

	/**
	 * Persist state to storage
	 */
	private async saveState(): Promise<void> {
		if (this.nextAllowedTime === null) {
			return; // State not loaded yet, nothing to save
		}

		try {
			await this.ctx.storage.put(STORAGE_KEY, this.nextAllowedTime);
		} catch (error) {
			// Fail-open: log error but continue
			console.error('Failed to save rate limiter state:', error);
		}
	}

	/**
	 * Check rate limit and update state
	 * @param config Rate limit configuration
	 * @returns Rate limit result with allowed status and retry information
	 */
	async check(
		config: RateLimitConfig = {
			millisecondsPerRequest: DEFAULT_MILLISECONDS_PER_REQUEST,
			gracePeriodMs: DEFAULT_GRACE_PERIOD_MS,
		}
	): Promise<RateLimitResult> {
		await this.loadState();

		const now = Date.now();
		const currentNextAllowed = this.nextAllowedTime ?? 0;

		// console.log('[RateLimiter] check called:', {
		// 	now,
		// 	currentNextAllowed,
		// 	config,
		// 	stateLoaded: this.stateLoaded,
		// });

		// Calculate the earliest time this request is allowed (accounting for grace period)
		// Grace period allows requests slightly before the exact spacing requirement
		// Cap grace period at spacing to prevent it from negating the rate limit
		const effectiveGracePeriod = Math.min(config.gracePeriodMs, config.millisecondsPerRequest);
		const earliestAllowed = currentNextAllowed - effectiveGracePeriod;

		// Check if request is allowed
		const allowed = now >= earliestAllowed;

		if (allowed) {
			// Update nextAllowedTime: either now or the stored value, whichever is later, plus spacing
			this.nextAllowedTime = Math.max(now, currentNextAllowed);
			this.nextAllowedTime += config.millisecondsPerRequest;
		} else {
			// Even if not allowed, we should still track the nextAllowedTime to prevent state drift
			// But don't update it, so the limit is enforced
		}

		// Calculate retry after (how long to wait before next allowed request)
		const retryAfterMs = allowed ? 0 : Math.max(0, earliestAllowed - now);

		// console.log('[RateLimiter] result:', {
		// 	allowed,
		// 	retryAfterMs,
		// 	earliestAllowed,
		// 	nextAllowedTime: this.nextAllowedTime,
		// });

		// Persist state (fire and forget - don't block on storage)
		await this.ctx.blockConcurrencyWhile(async () => {
			await this.saveState();
		});

		return {
			allowed,
			retryAfterMs,
			limitMs: config.millisecondsPerRequest,
		};
	}
}
