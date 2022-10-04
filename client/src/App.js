import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import { Route, Routes } from "react-router-dom";
import AuthProvider from "./context/auth";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";
import AuthRoute from "./utils/AuthRoute";
import SinglePost from './pages/SinglePost'

function App() {
  return (
    <AuthProvider>
      <Container>
        <MenuBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route exact path="/register" element={<AuthRoute><Register /></AuthRoute>  } />
          <Route exact path="/posts/:postId" element={<SinglePost />} />
        </Routes>
      </Container>
    </AuthProvider>
  );
}

export default App;
