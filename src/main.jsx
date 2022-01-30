import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import App from './App'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Team from "./pages/Team";
import Calendar from "./pages/Calendar";
import Documents from "./pages/Documents";
import Projects from "./pages/Project";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import SideBar from './components/SideBar'
const Pages = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

`;
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <SideBar />

    <Pages>
      <AnimatePresence exitBeforeEnter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/Roadmap" element={<Calendar />} />
          <Route path="/whitepaper" element={<Documents />} />
          <Route path="/projects" element={<App />} />
        </Routes>
      </AnimatePresence>
    </Pages>

    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
