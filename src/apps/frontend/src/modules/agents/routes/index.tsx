import { Route } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard';
import { AgentMetricsPage } from '../pages/Metrics';
import { AgentConfig } from '../pages/Config';

export const AgentRoutes = (
  <>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/agents/:agentId/metrics" element={<AgentMetricsPage />} />
    <Route path="/agents/:agentId/config" element={<AgentConfig />} />
  </>
);
