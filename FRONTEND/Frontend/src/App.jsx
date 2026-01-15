import { BrowserRouter, Routes, Route } from "react-router-dom";

import ExpensePage from "./components/expenses/ExpensePage";
import AuthPage from "./components/authentication/AuthPage";
import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import { PaymentProvider } from "./context/PaymentContext";
import { LeaderboardProvider } from "./context/LeaderBoardContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ExpenseProvider>
            <PaymentProvider>
              <LeaderboardProvider>
                <Routes>
                  <Route path="/" element={<AuthPage />} />

                  <Route path="/expenses" element={<ExpensePage />} />
                </Routes>
              </LeaderboardProvider>
            </PaymentProvider>
          </ExpenseProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
