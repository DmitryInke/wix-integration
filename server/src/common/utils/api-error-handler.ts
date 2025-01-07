import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export async function handleApiCall<T>(
  apiCall: Promise<T>,
  errorMessage: string,
): Promise<T> {
  try {
    return await apiCall;
  } catch (error) {
    Logger.error(`${errorMessage}: ${error.message}`, error.stack);
    throw new HttpException(
      error.response?.data || errorMessage,
      error.response?.status || HttpStatus.BAD_REQUEST,
    );
  }
}
