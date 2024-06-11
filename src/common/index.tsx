import * as React from "react";
import { createRoot } from 'react-dom/client';
import { Home } from "../components/Home/Home";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import "../../styles/index.css";

const root = createRoot(document.getElementById("content-area") as HTMLElement);
root.render(
  <HashRouter>
    <div>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  </HashRouter>
);
