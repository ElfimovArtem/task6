import { ErrorRequestHandler } from 'express';

import { logger } from '../utils/logger';

const errorHandlingMiddleware: ErrorRequestHandler = (error, { method, url }, response, _next) => {
  logger.error('Internal Error', { method, url, error });

  return response.status(500).end(error?.message);
};

export default errorHandlingMiddleware;