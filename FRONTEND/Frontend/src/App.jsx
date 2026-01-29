import { BrowserRouter, Routes, Route } from "react-router-dom";

import ExpensePage from "./components/expenses/ExpensePage";
import AuthPage from "./components/authentication/AuthPage";
import MainLayout from "./components/layout/MainLayout";
import LeaderboardPage from "./components/premium/Leaderboard";
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

                  
                  <Route element={<MainLayout />}>
                    <Route path="/expenses" element={<ExpensePage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                  </Route>
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
