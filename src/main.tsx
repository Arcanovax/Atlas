import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './index.css'

import React from 'react';
import Atlas from './Atlas';
import { Routes, Route } from "react-router-dom";


createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
            	<Route path="/" element={<Atlas />} />
         	</Routes>
        </BrowserRouter>
    </StrictMode>
);
