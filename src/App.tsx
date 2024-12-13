import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

import Login from "./Page/Login";
import Registration from "./Page/Registration";
import AddClient from "./Page/AddClient";
import Clients from "./Page/clients";
import MainDashBoard from "./Page/dashBoard";
import InvoiceDashBoard from "./Page/InvoiceDashBoard";
import AddInvoice from "./Page/AddInvoice";
import InvoicePage from "./Page/InvoicePage";
import AddCompany from "./Page/AddCompany";
import EditClient from "./Page/EditClient";
import EditInvoice from "./Page/EditInvoice";
import store from "./redux/apii/store";
import { Provider } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute"; // Import the new PublicRoute

const App = () => {
  return (
    <Provider store={store}>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route
            path="/register"
            element={<PublicRoute element={<Registration />} />}
          />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<MainDashBoard />} />}
          />
          <Route
            path="/clients"
            element={<PrivateRoute element={<Clients />} />}
          />
          <Route
            path="/invoicedashboard"
            element={<PrivateRoute element={<InvoiceDashBoard />} />}
          />
          <Route
            path="/addinvoice"
            element={<PrivateRoute element={<AddInvoice />} />}
          />
          <Route
            path="/invoice"
            element={<PrivateRoute element={<InvoicePage />} />}
          />
          <Route
            path="/addclient"
            element={<PrivateRoute element={<AddClient />} />}
          />
          <Route
            path="/addcompany"
            element={<PrivateRoute element={<AddCompany />} />}
          />
          <Route
            path="/editclient"
            element={<PrivateRoute element={<EditClient />} />}
          />
          <Route
            path="/editinvoice/:invoiceId"
            element={<PrivateRoute element={<EditInvoice />} />}
          />

          {/* Redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Provider>
  );
};

export default App;
