import NavBar from "./components/navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  About,
  Projects,
  Home,
  Login,
  ProjectPage,
  Register,
  MatchForm,
  ProjectPreference,
  Client,
  ProjectForm,
  TeachingTeam,
  TeachingSetUp,
  Student,
  ResetPassword,
  Error,
} from "./routes";
import "./App.css";

function App() {
  return (
    /*displays the webpages where it grabs the routes from the  specific webpages */
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/projectspage/:projectId" element={<ProjectPage />} />
        <Route path="/matchform" element={<MatchForm />} />
        <Route path="/projectPreference" element={<ProjectPreference />} />
        <Route path="/client" element={<Client />} />
        <Route path="/projectform" element={<ProjectForm />} />
        <Route path="/teachingteam" element={<TeachingTeam />} />
        <Route path="/Setup" element={<TeachingSetUp />} />
        <Route path="/student" element={<Student />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/Error404" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
