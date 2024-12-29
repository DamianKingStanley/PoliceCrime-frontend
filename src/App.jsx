// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./component/AuthContext";
import PrivateRoute from "./component/PrivateRoute";
import Home from "./pages/Home/Home";
import LogIn from "./pages/LogIn/LogIn";
import SignIn from "./pages/SignIn/SignIn";
import RecordForm from "./pages/RecordForm/RecordForm";
import RecordDetail from "./pages/RecordDetails/RecordDetails";
import SearchRecord from "./pages/SearchRecord/SearchRecord";
import AllRecords from "./pages/AllRecords/AllRecords";
import UpdateRecord from "./pages/UpdateRecord/UpdateRecord";
import AdvancedSearch from "./pages/AdvanceSearch/AdvancedSearch";
import Officers from "./pages/Officers/Officers";

const AppContent = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<SignIn />} />
          <Route path="/officers" element={<Officers />} />

          <Route
            path="/search"
            element={
              <PrivateRoute
                element={SearchRecord}
                roles={["admin", "officer"]}
              />
            }
          />
          <Route
            path="/advance-search"
            element={
              <PrivateRoute
                element={AdvancedSearch}
                roles={["admin", "officer"]}
              />
            }
          />
          <Route
            path="/all-records"
            element={<PrivateRoute element={AllRecords} roles={["admin"]} />}
          />
          <Route
            path="/records/:id"
            element={
              <PrivateRoute
                element={RecordDetail}
                roles={["admin", "officer"]}
              />
            }
          />
          <Route
            path="/create"
            element={<PrivateRoute element={RecordForm} role={["admin"]} />}
          />
          <Route
            path="/update/:id"
            element={<PrivateRoute element={UpdateRecord} roles={["admin"]} />}
          />
          {/* <Route
            path="/activities"
            element={<PrivateRoute element={AuditLogs} roles={["admin"]} />}
          /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const App = () => <AppContent />;

export default App;
