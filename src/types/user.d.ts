declare namespace Express {
  export interface Request {
    user: any;
  }
}

interface TokenData {
  id: string | null;
  sessionId?: string
}
