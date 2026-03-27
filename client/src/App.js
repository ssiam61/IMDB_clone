// import React, { Fragment } from "react";
// import './App.css';
// //components
// import Movies from "./componenets/movies";
// function App() {
//   return(
//     <Fragment>
//       <div className="container">
//         <Movies />
//       </div>
//     </Fragment>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";


import Auth from "./pages/auth";
import UserDashboard from "./pages/userDashboard";
import AdminDashboard from "./pages/adminDashboard";
import Movies from "./componenets/movies";
import MovieDetailPage from "./componenets/moviedetailpage";
import SeriesDetailPage from "./componenets/seriesdetailpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/series/:id" element={<SeriesDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;