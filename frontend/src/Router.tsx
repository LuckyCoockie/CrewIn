import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App";
import CrewCreatePage from "./pages/CrewCreatePage";
import PostCreatePage from "./pages/PostCreatePage";
import CourseCreatePage from "./pages/course/CourseCreatePage.tsx";
import LoginPage from "./pages/LoginPage";
import SessionCreatePage from "./pages/SessionCreatePage";
import SessionPage from "./pages/SessionPage";
import CrewPage from "./pages/CrewPage";
import ProfilePage from "./pages/ProfilePage";
import JoinPage from "./pages/JoinPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import PostMainPage from "./pages/PostMainPage";
import PostEditPage from "./pages/PostEditPage.tsx";
import SearchUserPage from "./pages/SearchUserPage";
import CrewDetailPage from "./pages/CrewDetailPage";
import AlarmPage from "./pages/AlarmPage.tsx";
import SessionSearchPage from "./pages/session/SessionSearchPage.tsx";
import CrewSearchPage from "./pages/crew/CrewSearchPage.tsx";
import CrewGallaryListDetailPage from "./pages/CrewGallaryListDetailPage.tsx";
import FindPasswordPage from "./pages/FindPasswordPage.tsx";
import NoticeCreatePage from "./pages/NoticeCreatePage.tsx";
import { ProfileInfoPage } from "./pages/ProfileInfoPage.tsx";
import ProtectedRoute from "./util/router/ProtectedRoute.tsx";
import UnprotectedRoute from "./util/router/UnprotectedRoute.tsx";
import CrewMemberPage from "./pages/crew/CrewMemberPage.tsx";
import CrewMemberSearchPage from "./pages/crew/CrewMemberSearchPage.tsx";
import CaptainPovCrewMemberPage from "./pages/crew/CaptainPovCrewMemberPage.tsx";
import CaptainPovCrewMemberSearchPage from "./pages/crew/CaptainPovCrewMemberSearchPage.tsx";
import CourseEditPage from "./pages/course/CourseEditPage.tsx";
import CoursePage from "./pages/course/CoursePage.tsx";
import CrewInvitePage from "./pages/crew/CrewInvitePage.tsx";
import MySessionPage from "./pages/session/MySessionPage.tsx";
import MyProfilePage from "./pages/MyProfilePage.tsx";
import PeopleProfilePage from "./pages/PeopleProfilePage.tsx";
import CrewRedirectPage from "./pages/crew/CrewRedirectPage.tsx";
import AttendancePage from "./pages/Attendance/AttendancePage.tsx";
import CrewNoticeDetailPage from "./pages/CrewNoticeDetailPage.tsx";
import CourseDetailPage from "./pages/course/CourseDetailPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <ProtectedRoute />,
        children: [
          { path: "", element: <Navigate to="/home" /> },
          { path: "home", element: <PostMainPage /> },
          {
            path: "session",
            element: <SessionPage />,
            children: [
              { path: "", element: <SessionSearchPage /> },
              { path: "create", element: <SessionCreatePage /> },
              {
                path: ":sessionId",
                children: [
                  { path: "", element: <SessionDetailPage /> },
                  { path: "attendance", element: <AttendancePage /> },
                ],
              },
            ],
          },
          {
            path: "crew",
            element: <CrewPage />,
            children: [
              { path: "", element: <CrewRedirectPage /> },
              { path: "search", element: <CrewSearchPage /> },
              { path: "create", element: <CrewCreatePage /> },
              {
                path: "gallary/:crewId",
                element: <CrewGallaryListDetailPage />,
              },
              {
                path: "detail/:crewId",
                element: <CrewDetailPage />,
              },
              {
                path: "detail/:crewId/noticecreate",
                element: <NoticeCreatePage />,
              },
              { path: "member", element: <CrewMemberPage /> },
              { path: "member/captain", element: <CaptainPovCrewMemberPage /> },
              { path: "membersearch", element: <CrewMemberSearchPage /> },
              {
                path: "membersearch/captain",
                element: <CaptainPovCrewMemberSearchPage />,
              },
              { path: "invite", element: <CrewInvitePage /> },
              {
                path: "detail/:crewId/notice/:noticeId",
                element: <CrewNoticeDetailPage />,
              },
            ],
          },
          { path: "mypage/session/:type", element: <MySessionPage /> },
          {
            path: "profile",
            element: <ProfilePage />,
            children: [
              { path: "", element: <MyProfilePage /> },
              { path: ":memberId", element: <PeopleProfilePage /> },
            ],
          },
          { path: "info", element: <ProfileInfoPage /> },
          {
            path: "course",
            element: <CoursePage />,
            children: [
              {
                path: "create",
                element: <CourseCreatePage />,
              },
              { path: ":courseId", element: <CourseDetailPage /> },
              {
                path: ":courseId/edit",
                element: <CourseEditPage />,
              },
            ],
          },
          { path: "post", element: <PostCreatePage /> },
          { path: "post/:postId/edit", element: <PostEditPage /> },
          { path: "searchuser", element: <SearchUserPage /> },
          { path: "alarm", element: <AlarmPage /> },
        ],
      },
      {
        path: "",
        element: <UnprotectedRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "join", element: <JoinPage /> },
          { path: "find-password", element: <FindPasswordPage /> },
        ],
      },
    ],
  },
]);
