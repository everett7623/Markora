import { Suspense, lazy } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './shared/components/AppLayout';

const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const ScannerPage = lazy(() => import('./features/scanner/ScannerPage'));
const ManagerPage = lazy(() => import('./features/manager/ManagerPage'));
const ImportExportPage = lazy(() => import('./features/import-export/ImportExportPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));

export function App() {
  return (
    <HashRouter>
      <AppLayout>
        <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading...</div>}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/manager" element={<ManagerPage />} />
            <Route path="/import-export" element={<ImportExportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </HashRouter>
  );
}
