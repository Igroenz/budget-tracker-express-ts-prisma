declare global {
  namespace Express {
    interface Request {
      user?: unknown;
      queryParsed?: unknown;
      paramsParsed?: unknown;
    }
  }
};

export {};