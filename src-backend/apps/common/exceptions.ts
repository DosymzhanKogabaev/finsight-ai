export class ServiceException extends Error {
	code: number;
	constructor(message: string = 'Service exception occurred', code: number = 500) {
		super(message);
		this.name = 'ServiceException';
		this.code = code;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class BadRequestException extends ServiceException {
	constructor(message: string = 'Bad request') {
		super(message, 400);
		this.name = 'BadRequestException';
	}
}

export class UnauthorizedException extends ServiceException {
	constructor(message: string = 'Unauthorized') {
		super(message, 401);
		this.name = 'UnauthorizedException';
	}
}
