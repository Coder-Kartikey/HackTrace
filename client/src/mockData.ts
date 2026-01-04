// Mock data for HackTrace dashboard
// This simulates the API responses from GET /api/traces and GET /api/traces/:id

export interface TracePattern {
  type: string;
  errorFn: string;
  failurePath: string[];
}

export interface TraceListItem {
  _id: string;
  session: {
    id: string;
    label: string;
  };
  source: string;
  pattern: TracePattern;
  createdAt: string;
}

export interface TraceDetail {
  _id: string;
  session: {
    id: string;
    label: string;
  };
  source: string;
  pattern: TracePattern;
  createdAt: string;
  trace: {
    stack: Array<{
      function: string;
      file: string;
      line: number;
      column: number;
      duration: number;
      type?: string;
      errorMessage?: string;
    }>;
    totalDuration: number;
    errorMessage: string;
  };
  explanation: string;
  suggestedFix: string;
  voice: {
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
}

export const mockTraces: TraceListItem[] = [
  {
    _id: 'tr_8x4k9m2p',
    session: {
      id: 'sess_2024_01_04_001',
      label: 'Production Deploy - v2.4.1',
    },
    source: 'api/checkout/process.ts',
    pattern: {
      type: 'NullPointerException',
      errorFn: 'calculateShipping',
      failurePath: ['processCheckout', 'validateCart', 'calculateShipping'],
    },
    createdAt: '2026-01-04T14:32:18Z',
  },
  {
    _id: 'tr_5n7h3q1w',
    session: {
      id: 'sess_2024_01_04_002',
      label: 'Staging - Feature Branch',
    },
    source: 'services/auth/verify.ts',
    pattern: {
      type: 'UnauthorizedError',
      errorFn: 'verifyToken',
      failurePath: ['middleware.auth', 'verifyToken'],
    },
    createdAt: '2026-01-04T13:45:03Z',
  },
  {
    _id: 'tr_9w2k5v8x',
    session: {
      id: 'sess_2024_01_04_003',
      label: 'Local Development',
    },
    source: 'database/queries/user.ts',
    pattern: {
      type: 'DatabaseTimeout',
      errorFn: 'fetchUserProfile',
      failurePath: ['getUserData', 'fetchUserProfile', 'db.query'],
    },
    createdAt: '2026-01-04T12:18:55Z',
  },
  {
    _id: 'tr_4p6m1n9z',
    session: {
      id: 'sess_2024_01_03_045',
      label: 'Production - Hotfix',
    },
    source: 'utils/validation/schema.ts',
    pattern: {
      type: 'ValidationError',
      errorFn: 'validatePayload',
      failurePath: ['handleRequest', 'validatePayload'],
    },
    createdAt: '2026-01-03T22:07:41Z',
  },
  {
    _id: 'tr_7t3r2k5m',
    session: {
      id: 'sess_2024_01_03_044',
      label: 'Production Deploy - v2.4.0',
    },
    source: 'api/webhooks/stripe.ts',
    pattern: {
      type: 'NetworkError',
      errorFn: 'handleWebhook',
      failurePath: ['processWebhook', 'handleWebhook', 'verifySignature'],
    },
    createdAt: '2026-01-03T19:23:12Z',
  },
];

export const mockTraceDetails: Record<string, TraceDetail> = {
  tr_8x4k9m2p: {
    _id: 'tr_8x4k9m2p',
    session: {
      id: 'sess_2024_01_04_001',
      label: 'Production Deploy - v2.4.1',
    },
    source: 'api/checkout/process.ts',
    pattern: {
      type: 'NullPointerException',
      errorFn: 'calculateShipping',
      failurePath: ['processCheckout', 'validateCart', 'calculateShipping'],
    },
    createdAt: '2026-01-04T14:32:18Z',
    trace: {
      stack: [
        {
          function: 'processCheckout',
          file: 'api/checkout/process.ts',
          line: 147,
          column: 12,
          duration: 234,
        },
        {
          function: 'validateCart',
          file: 'api/checkout/validate.ts',
          line: 89,
          column: 8,
          duration: 156,
        },
        {
          function: 'calculateShipping',
          file: 'services/shipping/calculator.ts',
          line: 203,
          column: 15,
          duration: 45,
        },
        {
          function: 'getShippingRate',
          file: 'services/shipping/rates.ts',
          line: 67,
          column: 21,
          duration: 12,
        },
      ],
      totalDuration: 447,
      errorMessage:
        'Cannot read property "address" of null at calculateShipping',
    },
    explanation:
      'The checkout process failed when attempting to calculate shipping costs. The error occurs because the shipping address object is null when the calculateShipping function tries to access its properties. This typically happens when a user proceeds to checkout without completing the shipping information step, or when the shipping data fails to persist properly in the session state.',
    suggestedFix:
      'Add null checking before accessing the address object. Implement defensive programming by validating that cart.shippingAddress exists and is properly populated before passing it to calculateShipping. Consider adding a validation step in validateCart to ensure all required checkout data is present before proceeding to shipping calculations.',
    voice: {
      confidence: 0.94,
      severity: 'high',
    },
  },
  tr_5n7h3q1w: {
    _id: 'tr_5n7h3q1w',
    session: {
      id: 'sess_2024_01_04_002',
      label: 'Staging - Feature Branch',
    },
    source: 'services/auth/verify.ts',
    pattern: {
      type: 'UnauthorizedError',
      errorFn: 'verifyToken',
      failurePath: ['middleware.auth', 'verifyToken'],
    },
    createdAt: '2026-01-04T13:45:03Z',
    trace: {
      stack: [
        {
          function: 'authMiddleware',
          file: 'middleware/auth.ts',
          line: 34,
          column: 5,
          duration: 89,
        },
        {
          function: 'verifyToken',
          file: 'services/auth/verify.ts',
          line: 112,
          column: 18,
          duration: 67,
        },
        {
          function: 'decodeJWT',
          file: 'utils/jwt.ts',
          line: 45,
          column: 9,
          duration: 23,
        },
      ],
      totalDuration: 179,
      errorMessage: 'Invalid token signature - verification failed',
    },
    explanation:
      'Authentication middleware is rejecting valid user tokens due to a signature verification mismatch. This issue emerged after rotating the JWT secret in the staging environment. The verifyToken function is using a cached version of the old secret key, causing all tokens signed with the new secret to fail validation.',
    suggestedFix:
      'Ensure the JWT_SECRET environment variable is properly updated across all service instances and that any in-memory caches of the secret are cleared. Implement a grace period for token verification that accepts both old and new secrets during secret rotation. Add monitoring alerts for unusual spikes in authentication failures.',
    voice: {
      confidence: 0.88,
      severity: 'medium',
    },
  },
};

// Helper function to get trace detail
export const getTraceDetail = (id: string): TraceDetail | undefined => {
  return mockTraceDetails[id];
};

// Helper function to get all traces
export const getTraces = (): TraceListItem[] => {
  return mockTraces;
};
