export class AppError extends Error {
  constructor(public statusCode: number, message: string, public details?: unknown) {
    super(message);
    this.name = this.constructor.name;
  }
};

export class NotFoundError extends AppError {
  constructor(message = "Data tidak ditemukan") {
    super(404, message)
  }
};

export class ConflictError extends AppError {
  constructor(message = "Data sudah ada", details?: unknown) {
    super(409, message, details)
  }
};

export class ValidationError extends AppError {
  constructor(message = "Validasi gagal", details?: unknown) {
    super(422, message, details)
  }
};

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message)
  }
};

export class ForbiddenError extends AppError {
  constructor(message = "Akses ditolak") {
    super(403, message)
  }
};