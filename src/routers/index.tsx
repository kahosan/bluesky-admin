import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { LoginPage } from '@/pages/login';
import { NotFoundError } from '@/pages/404';

export const Routers = () => (
  <Router>
    <Routes>
      <Route path="/" element={<div>Index</div>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundError title="This page could not be found." />} />
    </Routes>
  </Router>
);
