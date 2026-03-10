import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '../components/Header';
import { TraceList } from '../components/TraceList';
import { TraceDetail } from '../components/TraceDetail';

export default function App() {
  return (
    <Router>
      <div className="dark min-w-screen max-w-screen min-h-screen bg-zinc-950 text-zinc-100">
        <Header />
        <Routes>
          <Route path="/" element={<TraceList />} />
          <Route path="/trace/:id" element={<TraceDetail />} />
        </Routes>
      </div>
    </Router>
  );
}