import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ThreadedReviewList from "./components/ThreadedReviewList/ThreadedReviewList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/keyword/:name" element={<ThreadedReviewList />} />
      </Routes>
    </Router>
  );
}

export default App;
