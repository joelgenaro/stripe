import React from 'react'
import { useDispatch } from 'react-redux'
import { LinkContainer } from "react-router-bootstrap";
import { CSidebar, CSidebarBrand, CSidebarNav, CNavItem } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from "../../assets/images/footer-logo.svg";
import smallLogo from "../../assets/images/small-logo.svg";
import CIcon from '@coreui/icons-react'
import { cilUserPlus, cilVoiceOverRecord, cilLibrary, cilBook, cilLayers, cilChart, cilSortAscending, cilCash } from '@coreui/icons';
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { setSidebar } from "../../store/reducers/adminReducer";


const navigation = [{
  component: CNavItem,
  name: "Users",
  to: "/admin/users",
  icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  role: 1
}, {
  component: CNavItem,
  name: "Staff",
  to: "/admin/staff",
  icon: <CIcon icon={cilVoiceOverRecord} customClassName="nav-icon" />,
  role: 2
}, {
  component: CNavItem,
  name: "Years",
  to: "/admin/years",
  icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
  role: 1
}, {
  component: CNavItem,
  name: "Subjects",
  to: "/admin/subjects",
  icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  role: 1
}, {
  component: CNavItem,
  name: "Modules",
  to: "/admin/modules",
  icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  role: 1
}, {
  component: CNavItem,
  name: "Topics",
  to: "/admin/topics",
  icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  role: 1
}, {
  component: CNavItem,
  name: "Subtopics",
  to: "/admin/subtopics",
  icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  role: 1
}, {
  component: CNavItem,
  name: "Questions",
  to: "/admin/question",
  icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  role: 1
}, {
  component: CNavItem,
  name: "Membership pricing",
  to: "/admin/membership-pricing",
  icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
  role: 1
}, {
  component: CNavItem,
  name: "SEO",
  to: "/admin/seo",
  icon: <CIcon icon={cilSortAscending} customClassName="nav-icon" />,
  role: 1
}, {
  component: CNavItem,
  name: "Sales",
  to: "/admin/sales",
  icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  role: 2
}];

const AppSidebar = () => {
  const dispatch = useDispatch()
  return (
    <CSidebar
      position="fixed"
      unfoldable={true}
      visible={true}
      onVisibleChange={visible => dispatch(setSidebar(visible))}
    >
      <LinkContainer to="/">
        <CSidebarBrand className="d-none d-md-flex">
          <img className="sidebar-brand-full" src={logo} height={35} alt="Logo" style={{ marginLeft: -20 }} />
          <img className="sidebar-brand-narrow" src={smallLogo} height={35} alt="Logo" />
        </CSidebarBrand>
      </LinkContainer>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)