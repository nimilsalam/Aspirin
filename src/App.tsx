import { Navigate, Route, Routes } from 'react-router-dom';
import { AssessmentProvider } from './context/AssessmentContext';
import { LanguageSelect } from './pages/LanguageSelect';
import { Welcome } from './pages/Welcome';
import { Assessment } from './pages/Assessment';
import { Report } from './pages/Report';
import { DomainDetail } from './pages/DomainDetail';
import { Compare } from './pages/Compare';
import { History } from './pages/History';

export default function App() {
  return (
    <AssessmentProvider>
      <Routes>
        <Route path="/" element={<LanguageSelect />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report/:id" element={<Report />} />
        <Route path="/report/:id/:key" element={<DomainDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AssessmentProvider>
  );
}
