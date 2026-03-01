import type { NextApiRequest, NextApiResponse } from 'next';
import { withMiddleware } from '../../lib/middleware';

const openApi = {
  openapi: '3.0.0',
  info: { title: 'School Calculator API', version: '0.1.0' },
  paths: {
    '/api/schools': { get: { summary: 'List schools' } },
    '/api/schools/{id}': {
      get: {
        summary: 'Get school detail',
        parameters: [{ name: 'id', in: 'path' }],
      },
    },
    '/api/calculate': {
      post: { summary: 'Calculate finalScore and probability' },
    },
    '/api/health': { get: { summary: 'Health check' } },
  },
};

function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(openApi);
}

export default withMiddleware(handler);
