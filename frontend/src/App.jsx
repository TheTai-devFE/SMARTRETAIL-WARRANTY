import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Activation from './pages/Activation';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import PolicyPage from './pages/PolicyPage';
import RepairRequestPage from './pages/RepairRequestPage';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/technical" element={<AdminDashboard />} />
          <Route path="/chinh-sach" element={<PolicyPage />} />
          <Route path="/yeu-cau-sua-chua" element={<RepairRequestPage />} />
          <Route path="/activate/:id" element={<Activation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
