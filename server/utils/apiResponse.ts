export class ApiError extends Error {
  constructor(public statusCode: number, message: string, public errors?: unknown) {
    super(message);
  }
}

export function ok<T>(data: T, message = "Success") {
  return { success: true as const, data, message };
}
