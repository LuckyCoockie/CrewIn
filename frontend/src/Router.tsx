import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import CrewCreatePage from "./pages/CrewCreatePage";
import PostCreatePage from "./pages/PostCreatePage";
import CourseCreatePage from "./pages/course/CourseCreatePage.tsx";
import LoginPage from "./pages/LoginPage";
import SessionCreatePage from "./pages/SessionCreatePage";
import JoinPage from "./pages/JoinPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import PostMainPage from "./pages/PostMainPage";
import PostEditPage from "./pages/PostEditPage.tsx";
import SearchUserPage from "./pages/SearchUserPage";
import CrewDetailPage from "./pages/CrewDetailPage";
import AlarmPage from "./pages/AlarmPage.tsx";
import SessionSearchPage from "./pages/session/SessionSearchPage.tsx";
import CrewSearchPage from "./pages/crew/CrewSearchPage.tsx";
import CrewGalleryListDetailPage from "./pages/CrewGalleryListDetailPage.tsx";
import FindPasswordPage from "./pages/FindPasswordPage.tsx";
import CrewNoticeCreatePage from "./pages/CrewNoticeCreatePage.tsx";
import { ProfileInfoPage } from "./pages/ProfileInfoPage.tsx";
import ProtectedRoute from "./util/router/ProtectedRoute.tsx";
import UnprotectedRoute from "./util/router/UnprotectedRoute.tsx";
import CrewMemberPage from "./pages/crew/CrewMemberPage.tsx";
import CrewMemberSearchPage from "./pages/crew/CrewMemberSearchPage.tsx";
import CaptainPovCrewMemberPage from "./pages/crew/CaptainPovCrewMemberPage.tsx";
import CaptainPovCrewMemberSearchPage from "./pages/crew/CaptainPovCrewMemberSearchPage.tsx";
import CourseEditPage from "./pages/course/CourseEditPage.tsx";
import CrewInvitePage from "./pages/crew/CrewInvitePage.tsx";
import MySessionPage from "./pages/session/MySessionPage.tsx";
import MyProfilePage from "./pages/MyProfilePage.tsx";
import PeopleProfilePage from "./pages/PeopleProfilePage.tsx";
import CrewRedirectPage from "./pages/crew/CrewRedirectPage.tsx";
import AttendancePage from "./pages/attendance/AttendancePage.tsx";
import CrewNoticeDetailPage from "./pages/CrewNoticeDetailPage.tsx";
import CourseDetailPage from "./pages/course/CourseDetailPage.tsx";
import CrewEditPage from "./pages/CrewEditPage.tsx";
import SessionEditPage from "./pages/SessionEditPage.tsx";
import CrewNoticeEditPage from "./pages/CrewNoticeEditPage.tsx";
import PostDetailPage from "./pages/PostDetailPage.tsx";
import PeopleGalleryListDetailPage from "./pages/PeopleGalleryListDetailPage.tsx";
import NotFoundPage from "./pages/util/NotFoundPage.tsx";
import JoinAgreementPage from "./pages/JoinAgreementPage.tsx";

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
              { path: ":sessionId/edit", element: <SessionEditPage /> },
            ],
          },
          {
            path: "crew",
            children: [
              { path: "", element: <CrewRedirectPage /> },
              { path: "search", element: <CrewSearchPage /> },
              { path: "create", element: <CrewCreatePage /> },
              {
                path: "gallery/:crewId",
                element: <CrewGalleryListDetailPage />,
              },
              {
                path: "detail/:crewId",
                element: <CrewDetailPage />,
              },
              {
                path: "detail/:crewId/noticecreate",
                element: <CrewNoticeCreatePage />,
              },
              { path: "detail/:crewId/member", element: <CrewMemberPage /> },
              {
                path: "detail/:crewId/member/captain",
                element: <CaptainPovCrewMemberPage />,
              },
              {
                path: "detail/:crewId/membersearch",
                element: <CrewMemberSearchPage />,
              },
              {
                path: "detail/:crewId/membersearch/captain",
                element: <CaptainPovCrewMemberSearchPage />,
              },
              { path: ":crewId/invite", element: <CrewInvitePage /> },
              {
                path: "detail/:crewId/notice/:noticeId",
                element: <CrewNoticeDetailPage />,
              },
              {
                path: "detail/:crewId/notice/:noticeId/edit",
                element: <CrewNoticeEditPage />,
              },
              { path: "edit/:crewId", element: <CrewEditPage /> },
            ],
          },
          { path: "mypage/session/:type", element: <MySessionPage /> },
          {
            path: "profile",
            children: [
              { path: "", element: <MyProfilePage /> },
              { path: ":memberId", element: <PeopleProfilePage /> },
              {
                path: ":memberId/gallery",
                element: <PeopleGalleryListDetailPage />,
              },
            ],
          },
          { path: "info", element: <ProfileInfoPage /> },
          {
            path: "course",
            children: [
              { path: "", element: <Navigate to={"/profile"} /> },
              {
                path: "create",
                element: <CourseCreatePage />,
              },
              { path: ":courseId", element: <CourseDetailPage /> },
              {
                path: "edit/:courseId",
                element: <CourseEditPage />,
              },
            ],
          },
          { path: "post", element: <PostCreatePage /> },
          { path: "post/:postId/edit", element: <PostEditPage /> },
          { path: "searchuser", element: <SearchUserPage /> },
          { path: "alarm", element: <AlarmPage /> },
          { path: "post/:id", element: <PostDetailPage /> },
        ],
      },
      {
        path: "",
        element: <UnprotectedRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "join", element: <JoinPage /> },
          { path: "agreement", element: <JoinAgreementPage /> },
          { path: "find-password", element: <FindPasswordPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
