import { BrowserRouter, Routes, Route } from "react-router-dom";

import ExpensePage from "./components/expenses/ExpensePage"
import AuthPage from "./components/authentication/AuthPage"

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<AuthPage/>}/>
      
      <Route path='/expenses' element={<ExpensePage/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
