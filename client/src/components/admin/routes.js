import React from "react";
const Users = React.lazy(() => import("../../pages/admin/Users"));
const User = React.lazy(() => import("../../pages/admin/User"));
const Staffs = React.lazy(() => import("../../pages/admin/Staffs"));
const Staff = React.lazy(() => import("../../pages/admin/Staff"));
const Years = React.lazy(() => import("../../pages/admin/Years"));
const Subjects = React.lazy(() => import("../../pages/admin/Subjects"));
const CreateSubject = React.lazy(() => import("../../pages/admin/CreateSubject"));
const EditSubject = React.lazy(() => import("../../pages/admin/EditSubject"));
const Modules = React.lazy(() => import("../../pages/admin/Modules"));
const CreateModule = React.lazy(() => import("../../pages/admin/CreateModule"));
const EditModule = React.lazy(() => import("../../pages/admin/EditModule"));
const Topics = React.lazy(() => import("../../pages/admin/Topics"));
const CreateTopic = React.lazy(() => import("../../pages/admin/CreateTopic"));
const EditTopic = React.lazy(() => import("../../pages/admin/EditTopic"));
const SubTopics = React.lazy(() => import("../../pages/admin/SubTopics"));
const CreateSubTopic = React.lazy(() => import("../../pages/admin/CreateSubTopic"));
const EditSubTopic = React.lazy(() => import("../../pages/admin/EditSubTopic"));
const Questions = React.lazy(() => import("../../pages/admin/Questions"));
const CreateQuestion = React.lazy(() => import("../../pages/admin/CreateQuestion"));
const EditQuestion = React.lazy(() => import("../../pages/admin/EditQuestion"));
const MembershipPricing = React.lazy(() => import("../../pages/admin/MembershipPricing"));
const Sales = React.lazy(() => import("../../pages/admin/Sales"));
const Seo = React.lazy(() => import("../../pages/admin/Seo"));
const CreateSeo = React.lazy(() => import("../../pages/admin/CreateSeo"));
const EditSeo = React.lazy(() => import("../../pages/admin/EditSeo"));
const Messages = React.lazy(() => import("../../pages/admin/Messages"));
// const Profile = React.lazy(() => import("../../pages/admin/Profile"));
const Login = React.lazy(() => import("../../pages/admin/Login"));

const routes = [{
    path: "/", exact: true, name: "Home"
}, {
    path: "/users", exact: true, name: "Users", element: Users, private: true, role: 1
}, {
    path: "/users/:id", exact: true, name: "User", element: User, private: true, role: 1
}, {
    path: "/staff", exact: true, name: "Staffs", element: Staffs, private: true, role: 2,
}, {
    path: "/staff/:id", exact: true, name: "Staff", element: Staff, private: true, role: 2,
}, {
    path: "/years", exact: true, name: "Years", element: Years, private: true, role: 1
}, {
    path: "/subjects", exact: true, name: "Subjects", element: Subjects, private: true, role: 1
}, {
    path: "/subjects/create", exact: true, name: "Create Subject", element: CreateSubject, private: true, role: 1
}, {
    path: "/subjects/edit/:id", exact: true, name: "Edit Subject", element: EditSubject, private: true, role: 1
}, {
    path: "/modules", exact: true, name: "Modules", element: Modules, private: true, role: 1
}, {
    path: "/modules/create", exact: true, name: "Create Module", element: CreateModule, private: true, role: 1
}, {
    path: "/modules/edit/:id", exact: true, name: "Edit Module", element: EditModule, private: true, role: 1
}, {
    path: "/topics", exact: true, name: "Topics", element: Topics, private: true, role: 1
}, {
    path: "/topics/create", exact: true, name: "Create Topic", element: CreateTopic, private: true, role: 1
}, {
    path: "/topics/edit/:id", exact: true, name: "Edit Topic", element: EditTopic, private: true, role: 1
}, {
    path: "/subtopics", exact: true, name: "Sub Topics", element: SubTopics, private: true, role: 1
}, {
    path: "/subtopics/create", exact: true, name: "Create Sub Topic", element: CreateSubTopic, private: true, role: 1
}, {
    path: "/subtopics/edit/:id", exact: true, name: "Edit Sub Topic", element: EditSubTopic, private: true, role: 1
}, {
    path: "/question", exact: true, name: "Questions", element: Questions, private: true, role: 1
}, {
    path: "/question/create", exact: true, name: "Create Question", element: CreateQuestion, private: true, role: 1
}, {
    path: "/question/edit/:id", exact: true, name: "Edit Question", element: EditQuestion, private: true, role: 1
}, {
    path: "/sales", exact: true, name: "Sales", element: Sales, private: true, role: 2
}, {
    path: "/membership-pricing", exact: true, name: "Membership Pricing", element: MembershipPricing, private: true, role: 1
}, {
    path: "/seo", exact: true, name: "SEO", element: Seo, private: true, role: 1
}, {
    path: "/seo/create", exact: true, name: "Create SEO", element: CreateSeo, private: true, role: 1
}, {
    path: "/seo/edit/:id", exact: true, name: "Edit SEO", element: EditSeo, private: true, role: 1
}, {
    path: "/messages", exact: true, name: "Messages", element: Messages, private: true, role: 1
}, {
    // path: "/profile", exact: true, name: "Profile", element: Profile, private: true, role: 1
}, {
    path: "/login", exact: true, name: "Login", element: Login, private: false,
}];

export default routes;