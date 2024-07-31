import { CContainer, CHeader, CHeaderBrand, CHeaderNav } from '@coreui/react'
import { LinkContainer } from "react-router-bootstrap";
import logo from "../../assets/images/logo.svg";
import { AppHeaderDropdown } from './index'
import './AppHeader.css';

const AppHeader = () => {

  return (
    <CHeader position="sticky" className="mb-4 app-header">
      <CContainer fluid>
        <LinkContainer to="/">
          <CHeaderBrand className="d-md-none">
            <img src={logo} height={48} alt="Logo" />
          </CHeaderBrand>
        </LinkContainer>
        <CHeaderNav className="d-none d-md-flex me-auto">
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
