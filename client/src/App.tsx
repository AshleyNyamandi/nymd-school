import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider,
  Outlet,
  ScrollRestoration
} from "react-router";

import Home from "./pages/Home"
import TutorSupport from "./pages/TutorSupport"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import VerifyEmailMessage from "./pages/VerifyEmailMessage"
import EmailVerified from "./pages/VerifiedEmail"
import AdminDashboard from "./pages/AdminDashboard"
import AdminLayout from "./Layout/AdminLayout"
import UploadMaterials from "./pages/UploadMaterials"
import TutorRequests from "./pages/TutorRequests"
import SubjectMaterial from "./pages/SubjectMaterial"
import ProtectedRoute from "./Layout/ProtectedRoute"
import Unauthorized from "./pages/Unauthorised"
import NotFound from "./pages/NotFound"
import AdminSignIn from "./pages/AdminSignIn"
import UsersPage from "./pages/UsersPage"
import AdminSettings from "./pages/AdminSettings"
import ContactUs from "./pages/ContactUsPage"
import MaterialOptions from "./pages/MaterialOptions";
import VirtualClassesPage from "./pages/VirtualClassesPage";
import QuizeAndTests from "./pages/QuizeAndTests";
import AiTeachingAssistant from "./pages/AiTeachingAssistant";
import PastPapers from "./pages/PastPapers";
import NotesPage from "./pages/NotesPage";
import RevisionQuestions from "./pages/RevisionQuestions";


function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(

    <Route element={<RootLayout />}>
      <Route path="/" element={<Home />}/>
      <Route path="/virtual-classes" element={<VirtualClassesPage />} />
      <Route path="/quizzes-and-tests" element={<QuizeAndTests />} />
      <Route path="/ai-teaching-assistant" element={<AiTeachingAssistant />} />
      
      <Route path="/level/:level/subject/:subject">
        <Route index element={<MaterialOptions />} />
        <Route path="past-papers" element={<PastPapers />}/>
        <Route path="notes" element={<NotesPage />} />
        <Route path="revision-questions" element={<RevisionQuestions />} />
        <Route path="past-papers/year/:year" element={<SubjectMaterial />}/>
      </Route>      
      
      <Route path="/tutor-support" element={<TutorSupport />}/>
      <Route path="contact" element={<ContactUs />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/check-email" element={<VerifyEmailMessage />} />
      <Route path="/verify-email" element={<EmailVerified />} />

      <Route path="/admin/sign-in" element={<AdminSignIn />} />
      
      <Route element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>  
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="upload-material" element={<UploadMaterials />}/>
          <Route path="tutor-request" element={<TutorRequests />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />}/>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
