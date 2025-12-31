import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Activation from './pages/Activation';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import PolicyPage from './pages/PolicyPage';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/chinh-sach" element={<PolicyPage />} />
          <Route path="/activate/:id" element={<Activation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
