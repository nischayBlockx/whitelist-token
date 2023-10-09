import React from "react";
import './App.css';
import Web3ProviderNew from './components/WalletProvider';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Admin from "./components/pages/Admin";
import NotFound from "./components/pages/NotFound";

function App() {
  return (
    <Web3ProviderNew>
       <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
    </Web3ProviderNew>
  );
}

export default App;
