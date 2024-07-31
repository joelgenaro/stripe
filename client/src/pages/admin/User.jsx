import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Http from '../../services/Http'
import { Card, Table, Form, Row, Col, Button, Modal, Accordion, InputGroup } from 'react-bootstrap'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { Formik } from 'formik'
import * as yup from 'yup'
import moment from 'moment'
import { toast } from 'react-toastify'
import { LazyLoadImage } from "react-lazy-load-image-component";
import AmountSvg from "../../assets/images/svg/invoices/amount.svg"
import './User.css';

const User = () => {
  const autoFocusButtonRef = useRef(null);
  const params = useParams()
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', oauth: false });
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});

  const [userMemberships, setUserMemberships] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [editMembershipId, setEditMembershipId] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(-1);
  const [currentInvoice, setCurrentInvoice] = useState(-1);
  const [invoiceIsOpen, setInvoiceIsOpen] = useState(false);
  const [invoiceIsEdited, setInvoiceIsEdited] = useState(false);
  const [removeInvoiceIdx, setRemoveInvoiceIdx] = useState(0);
  const [removeMembershipIdx, setRemoveMembershipIdx] = useState(0);
  const [invoiceIdx, setInvoiceIdx] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [subjectInvoices, setSubjectInvoices] = useState([]);
  const [newInvoices, setNewInvoices] = useState([{ _id: -1, invoice_id: "None" }]);
  const [isEdit, setIsEdit] = useState(false);
  const [editInvoices, setEditInvoices] = useState([]);
  const [invoice, setInvoice] = useState({});
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [membershipIsOpen, setMembershipIsOpen] = useState(false);
  const [membershipIsEdited, setMembershipIsEdited] = useState(false);
  const [membershipModalShow, setMembershipModalShow] = useState(false);
  const [membershipModalContent, setMembershipModalContent] = useState({});
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [removeType, setRemoveType] = useState('');
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState('');
  const [membershipUntilDate, setMembershipUntilDate] = useState(moment(new Date()).add(12, 'months').format('YYYY-MM-DD'));
  const [expiredDate, setExpiredDate] = useState('');
  var taxInvIdx = 0;

  const validationProfileSchema = yup.object({
    firstName: yup.string().required('First name is required.'),
    lastName: yup.string().required('Last name is required.'),
    email: yup
      .string()
      .email('Enter a vaild email.')
      .required('Email is required.')
  });
  const validationPasswordsSchema = yup.object({
    password: yup
      .string()
      .required('Password is required.')
      .min(8, 'Password should be minimum 8 characters in length.')
      .required('Password is required.'),
    confirmPassword: yup
      .string()
      .test('password-match', 'Password and Confirm password do not match.', function (value) {
        return this.parent.password === value
      })
  })
  const validationInvoiceSchema = yup.object({
    invoiceDescription: yup
      .string()
      .required('invoice description required'),
    paidDate: yup.date('Enter paid date.')
      .required('Please enter a name.'),
    total: yup.number()
      .required('Required field.')
      .min(1),
  });
  useEffect(() => {
    const getUser = async () => {
      let id = params.id
      let { data } = await Http.get(`admin/users/${id}`)
      setUser({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        oauth: data.user.oauth
      });
      setUserMemberships(data.memberships)
      setInvoices(data.invoices)
      setSubjectInvoices(data.subjectInvoices);
    }
    getUser()
  }, []);
  useEffect(() => {
    const getYears = async () => {
      let { data } = await Http.get('years')
      if (data.success) {
        setYears(data.data)
      } else {
        toast.error(data.msg)
      }
    }
    getYears()
  }, [])
  const selectSubject = (_subject, year) => {
    let subjects = selectedSubjects;
    let find = subjects.findIndex(subject => subject._id === _subject._id);
    if (find > -1) {
      subjects.splice(find, 1)
    } else {
      subjects.push(_subject)
    }
    setSelectedSubjects([...subjects]);
  }
  const isSelectedSubject = _subject => {
    if (selectedSubjects.findIndex(subject => subject._id === _subject._id) === -1) {
      return false
    } else {
      return true
    }
  }
  const updateProfile = async (user, { resetForm }) => {
    let { data } = await Http.put(`admin/users/${params.id}`, user);
    if (data.status) {
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
    }
  }
  const updatePassword = async (passwords, { resetForm }) => {
    let { data } = await Http.put(`admin/users/${params.id}/password`, {
      password: passwords.password
    });
    if (data.status) {
      resetForm();
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
    }
  }
  const onAddInvoice = async (invoice_, { resetForm }) => {
    invoice_.status = false;
    let { data } = await Http.post(`admin/users/${params.id}/invoice`, invoice_);
    if (data.success) {
      toast.success(data.msg);
      setInvoices([...invoices, data.data]);
      setEditInvoices([...editInvoices, data.data]);
      resetForm();
      setInvoiceIsOpen(false);
    } else {
      toast.error(data.msg);
    }
  }
  const viewInvoice = idx => {
    setInvoice(invoices[idx]);
    setInvoiceModalOpen(true);
  }
  const onEditInvoice = async (invoice_, { resetForm }) => {
    let { data } = await Http.put(`admin/users/${params.id}/invoice`, invoice_);
    if (data.success) {
      toast.success(data.msg);
      let newInvoices = invoices.map((_invoice, idx) => {
        if (idx === invoice_.invoiceIdx) {
          return data.data
        } else {
          return _invoice;
        }
      });
      setInvoices(newInvoices);
      resetForm();
      setInvoiceIsOpen(false);
    } else {
      toast.error(data.msg);
    }
  }
  const invoiceModal = (isEdited, idx) => {
    setInvoiceIsEdited(isEdited);
    setInvoiceIdx(idx);
    setInvoiceIsOpen(true);
    getLastInvoiceNumber();
  }
  const getLastInvoiceNumber = async () => {
    let { data } = await Http.post(`/admin/users/lastInvoice`);
    if (data.success) {
      setLastInvoiceNumber(data.data)
    } else {
      toast.error(data.msg)
    }
  }
  const removeInvoice = async (idx) => {
    let invoiceId = invoices[idx]._id;
    if (invoices[idx].status === true) {
      toast.error("This invoice is active.");
      return;
    }

    let { data } = await Http.delete(`admin/users/${params.id}/invoice/${invoiceId}`);
    if (data.success) {
      toast.success(data.msg);
      let temp = invoices;
      temp.splice(idx, 1)
      setInvoices(temp);
      setRemoveModalIsOpen(false);
      setInvoiceIsEdited(false);
    } else {
      toast.error(data.msg);
    }
  }
  const addMembership = async () => {
    if (membershipUntilDate < new Date()) {
      toast.error("Date must be in the future.");
    }
    // else if (selectedSubjects.length === 0) {
    //   toast.error("Please select subjects.");
    // } 
    else {
      let { data } = await Http.post(`admin/users/${params.id}/membership`, {
        // selectedSubjects,
        // selectedInvoice,
        // membershipUntilDate,
        selectedSubject: selectedSubject,
        membershipUntilDate: membershipUntilDate,
        selectedInvoice: selectedInvoice
      });
      if (data.success) {
        toast.success(data.msg);
        setUserMemberships(data.data);
        for (let i in invoices) {
          if (invoices[i]._id === selectedInvoice) {
            invoices[i].status = true;
            break;
          }
        }
        setInvoices(invoices)
        onHideMembershipModal();
      } else {
        toast.error(data.msg);
        onHideMembershipModal();
      }
    }
  }

  const editMembership = async () => {
    if (membershipUntilDate < new Date()) {
      toast.error("Date must be in the future.");
    }
    // else if (selectedSubjects.length === 0) {
    //   toast.error("Please select subjects.");
    // } 
    else {
      let { data } = await Http.put(`admin/users/${params.id}/membership`, {
        selectedSubjects,
        selectedInvoice,
        currentInvoice,
        editMembershipId,
        membershipUntilDate: membershipUntilDate
      });
      if (data.success) {
        toast.success(data.msg);
        setUserMemberships(data.data);
        // for (let i in invoices) {
        //   if (invoices[i]._id === currentInvoice)
        //     invoices[i].status = false;
        //   if (invoices[i]._id === selectedInvoice)
        //     invoices[i].status = true;
        // }
        // setInvoices(invoices);
      } else {
        toast.error(data.msg);
      }
      onHideMembershipModal();
    }
  }
  const membershipModal = (isEdited, idx, _membership) => {
    setMembershipIsEdited(isEdited);
    setMembershipIsOpen(true);

    let tempInvoices = [];
    for (let i in invoices) {
      if (!invoices[i].status)
        tempInvoices.push(invoices[i]);
    }
    if (isEdited) {
      setIsEdit(true);
      if (_membership.invoice)
        setEditInvoices([...tempInvoices, _membership.invoice]);
      else
        setEditInvoices(tempInvoices);
      setSelectedInvoice(_membership.invoice == null ? -1 : _membership.invoice._id);
      // setSelectedSubjects([..._membership.subjects]);
      setEditMembershipId(_membership._id);
      setCurrentInvoice(_membership.invoice == null ? -1 : _membership.invoice._id);
      setExpiredDate(_membership.expiredDate);

      // DevKing
      setSelectedYear(_membership.subject.year);
      setSubjects(_membership.subject.year.subjects);
      setSelectedSubject(_membership.subject);
      setMembershipUntilDate(moment(_membership.expiredDate).format('YYYY-MM-DD'));
    } else if (newInvoices.length) {
      setIsEdit(false);

      // DevKing
      setNewInvoices(tempInvoices);
      setSelectedYear(years[0]);
      setSubjects(years[0]?.subjects);
      setSelectedSubject(years[0]?.subjects[0]);
    }
  }
  const removeMembership = async (membershipId) => {
    let { data } = await Http.delete(`admin/users/${params.id}/membership/${membershipId}`);
    if (data.success) {
      toast.success(data.msg);
      setUserMemberships(data.memberships);

      if (data.deletedInvoice !== null && data.deletedInvoice !== "") {
        let selectedInvoice = data.deletedInvoice
        for (let i in invoices) {
          if (invoices[i]._id === selectedInvoice._id)
            invoices[i].status = false;
        }
        setInvoices(invoices);
      }
      setRemoveModalIsOpen(false);
    } else {
      toast.error(data.msg);
    }
  }
  const onHideMembershipModal = () => {
    setIsEdit(false);
    setSelectedInvoice(-1);
    setSelectedSubjects([]);
    setEditInvoices([]);
    setMembershipIsOpen(false)
    setMembershipUntilDate(moment(new Date()).add(12, 'months').format('YYYY-MM-DD'));
  }
  const removeModal = (type, idx) => {
    if (type === 'invoice') {
      setRemoveInvoiceIdx(idx);
      setRemoveType('invoice');
    } else {
      setRemoveMembershipIdx(idx);
      setRemoveType('membership');
    }
    setRemoveModalIsOpen(true);

    setTimeout(() => { autoFocusButtonRef.current.focus() }, 500);
  }
  const onMembershipModalBtn = (idx) => {
    setMembershipModalShow(true);
    setMembershipModalContent(userMemberships[idx]);
  }
  const handleUntilChange = (e) => {
    setMembershipUntilDate(e.target.value)
    setExpiredDate(e.target.value)
  }
  const isEmpty = function (obj) {
    for (var key in obj)
      if (obj.hasOwnProperty(key))
        return false;
    return true;
  }

  const changeYear = function (id) {
    let yearIdx = years.findIndex(year => year._id === id);
    setSelectedYear(years[yearIdx]);
    setSubjects(years[yearIdx].subjects);
  }

  const changeSubject = function (id) {
    let subjectIdx = subjects.findIndex(subject => subject._id == id);
    setSelectedSubject(subjects[subjectIdx]);
  }


  return (
    <Row gutter={15}>
      <Col md={6}>
        <Card className='mb-4'>
          <Card.Header
            style={{ background: '#3c4b64' }}
            bsPrefix='card-header py-3'
          >
            <Card.Title as='h1' style={{ fontSize: 24 }} bsPrefix='mb-0 card-title text-light'>
              User profile
            </Card.Title>
          </Card.Header>
          <Card.Body className='p-4'>
            <Formik
              enableReinitialize={true}
              validationSchema={validationProfileSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={updateProfile}
              initialValues={user}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>First name:</Form.Label>
                        <Form.Control
                          type='text'
                          name='firstName'
                          onChange={handleChange}
                          value={values.firstName}
                          readOnly={values.oauth ? true : false}
                          isInvalid={!!errors.firstName}
                          touched={touched}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Last name:</Form.Label>
                        <Form.Control
                          type='text'
                          name='lastName'
                          onChange={handleChange}
                          value={values.lastName}
                          isInvalid={!!errors.lastName}
                          readOnly={values.oauth ? true : false}
                          touched={touched}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                          type='email'
                          name='email'
                          onChange={handleChange}
                          value={values.email}
                          isInvalid={!!errors.isInvalid}
                          touched={touched}
                          readOnly={values.oauth ? true : false}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" variant='primary' style={{ float: 'right' }} disabled={values.oauth ? true : false}>
                    Update profile
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Col>
      {user.oauth === true ? '' : <>
        <Col md={6}>
          <Card className='mb-4'>
            <Card.Header
              style={{ background: '#3c4b64' }}
              bsPrefix='card-header py-3'
            >
              <Card.Title as='h1' style={{ fontSize: 24 }} bsPrefix='mb-0 card-title text-light'>
                Change password
              </Card.Title>
            </Card.Header>
            <Card.Body className='p-4'>
              <Formik
                enableReinitialize={true}
                validationSchema={validationPasswordsSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={updatePassword}
                initialValues={passwords}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                      <Form.Label>New password:</Form.Label>
                      <Form.Control
                        type='password'
                        name="password"
                        onChange={handleChange}
                        value={values.password}
                        isInvalid={!!errors.password}
                        touched={touched}
                      />
                      <Form.Control.Feedback type='invalid'>{errors.password}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                      <Form.Label>Confirm password:</Form.Label>
                      <Form.Control
                        type='password'
                        name="confirmPassword"
                        onChange={handleChange}
                        value={values.confirmPassword}
                        isInvalid={!!errors.confirmPassword}
                        touched={touched} />
                      <Form.Control.Feedback type='invalid'>{errors.confirmPassword}</Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" variant='primary' style={{ float: 'right' }}>
                      Change password
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </>
      }
      <Col md={12}>
        <Card className='mb-4'>
          <Card.Header
            style={{ background: '#3c4b64' }}
            bsPrefix='card-header py-3'
          >
            <Card.Title as='h1' style={{ fontSize: 24 }} bsPrefix='mb-0 card-title text-light'>
              Invoice histories
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Table bordered hover className='text-center mb-0'>
              <thead
                style={{
                  background: '#3c4b64',
                  color: '#fafafa',
                  borderColor: 'rgb(44 56 74 / 95%)'
                }}
              >
                <tr>
                  <th>Invoice number</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Issue date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length ? (
                  invoices.map((invoice, idx) => (
                    <tr key={idx}>
                      <td>INV-{invoice.invoice_id}</td>
                      <td>${invoice.amount}</td>
                      <td>{invoice.isPaid ? 'Paid' : 'Not paid'}</td>
                      <td>
                        {moment(invoice.paid_date).format(
                          'DD/MM/YYYY'
                        )}
                      </td>
                      <td>
                        <Button variant="success" size="sm" className="me-1" onClick={() => viewInvoice(idx)}><i className="fa fa-eye"></i></Button>
                        <Button variant="primary" size="sm" className="me-1" onClick={() => invoiceModal(true, idx)}><i className="fa fa-edit"></i></Button>
                        <Button variant="danger" size="sm" className="me-1" onClick={() => removeModal('invoice', idx)}><i className="fa fa-trash"></i></Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className='text-danger'>
                      Empty invoices
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Button variant="primary" size="sm" className="mt-3" onClick={() => invoiceModal(false)}>
              <i className="fa fa-plus"></i> Add invoice</Button>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12}>
        <Card className='mb-4'>
          <Card.Header
            style={{ background: '#3c4b64' }}
            bsPrefix='card-header py-3'
          >
            <Card.Title as='h1' style={{ fontSize: 24 }} bsPrefix='mb-0 card-title text-light'>
              Current memberships
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Table bsPrefix='table table-bordered' className='text-center'>
              <thead
                style={{
                  background: '#3c4b64',
                  color: '#fafafa',
                  borderColor: 'rgb(44 56 74 / 95%)'
                }}
              >
                <tr>
                  <th>Subjects</th>
                  <th>Invoice number</th>
                  <th>Current until</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {userMemberships.length ? (
                  userMemberships.map((membership, idx) => {
                    return (
                      <tr key={idx}>
                        <td>
                          {membership.subject.year.name} - {membership.subject.name}
                          {/* <ul className='mb-0' style={{ listStyleType: 'none' }}>
                            {membership.subjects && membership.subjects.map((subject, idx) => (
                              <li key={idx}>
                                {subject.year.name} - {subject.name}
                              </li>
                            ))}
                          </ul> */}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>{membership.invoice == null ? '' : 'INV-' + membership.invoice.invoice_id}</td>
                        <td style={{ verticalAlign: 'middle' }}>
                          {
                            moment(membership.expiredDate).format('DD/MM/YYYY')
                          }
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <Button variant="success" size="sm" className="me-1" onClick={() => onMembershipModalBtn(idx)}><i className="fa fa-eye"></i></Button>
                          <Button variant="primary" size="sm" className="me-1" onClick={() => membershipModal(true, idx, membership)}><i className="fa fa-edit"></i></Button>
                          <Button variant="danger" size="sm" className="me-1" onClick={() => removeModal('membership', membership._id)}><i className="fa fa-trash"></i></Button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className='text-danger'>
                      Empty memberships
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Button variant="primary" size="sm" onClick={() => membershipModal(false)}><i className="fa fa-plus"></i> Add membership</Button>
          </Card.Body>
        </Card>
      </Col>
      <Modal
        show={membershipIsOpen}
        onHide={() => setMembershipIsOpen(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size='lg'
        className='add-modal'
      >
        <Modal.Body className='p-4'>
          <Modal.Title as='h1' className='mb-2'>
            {membershipIsEdited ? "Edit" : "Add"} membership
          </Modal.Title>
          {/* <div>
            <p className='fs-5 fw-400 mb-1'>Subject(s)</p>
            <Accordion defaultActiveKey={-1}>
              {years.map((year, idx) => (
                <Accordion.Item key={idx} eventKey={idx}>
                  <Accordion.Header>{year.name}</Accordion.Header>
                  <Accordion.Body>
                    <ul className='mb-0 nav flex-column'>
                      {year.subjects.map((subject, idx) => (
                        <li
                          key={idx}
                          className='py-2'
                          onClick={() => selectSubject(subject, year)}
                          style={{ cursor: 'pointer' }}
                        >
                          {subject.name}
                          <Form.Check
                            inline
                            name='subjects'
                            className='float-end'
                            checked={isSelectedSubject(subject) ? true : false}
                            value={subject}
                            onChange={() => { }}
                          />
                        </li>
                      ))}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div> */}
          <Row className="mb-3">
            <Col sm={12} lg={6}>
              <InputGroup className='mb-2'>
                <InputGroup.Text>Year</InputGroup.Text>
                <Form.Select
                  name="year"
                  value={selectedYear?._id}
                  onChange={(ev) => changeYear(ev.target.value)}
                  disabled={membershipIsEdited ? true : false}
                >
                  {
                    years.map((year, idx) => (
                      <option value={year._id} key={idx}>{year.name}</option>
                    ))
                  }
                </Form.Select>
              </InputGroup>
            </Col>
            <Col sm={12} lg={6}>
              <InputGroup className='mb-2'>
                <InputGroup.Text>Subject</InputGroup.Text>
                <Form.Select
                  name="subject"
                  value={selectedSubject?._id}
                  onChange={(ev) => changeSubject(ev.target.value)}
                  disabled={membershipIsEdited ? true : false}
                >
                  {
                    subjects.map((subject, idx) => (
                      <option value={subject._id} key={idx}>{subject.name}</option>
                    ))
                  }
                </Form.Select>
              </InputGroup>
            </Col>
            <Col sm={12} lg={6}>
              <InputGroup className='mb-2'>
                <InputGroup.Text>Current Until</InputGroup.Text>
                <Form.Control
                  type="date"
                  name="untilDate"
                  value={membershipIsEdited ? moment(expiredDate).format('YYYY-MM-DD') : membershipUntilDate}
                  onChange={handleUntilChange}
                />
              </InputGroup>
            </Col>
            <Col sm={12} lg={6}>
              <InputGroup>
                <InputGroup.Text>Invoice</InputGroup.Text>
                <Form.Select
                  name="link-invoice"
                  value={selectedInvoice}
                  onChange={isEdit ? (ev) => { setSelectedInvoice(ev.target.value); } : (ev) => setSelectedInvoice(ev.target.value)}
                  disabled={membershipIsEdited ? true : false}
                >
                  {
                    (newInvoices.length === 0 || newInvoices[0]._id !== -1) && newInvoices.unshift({ _id: -1, invoice_id: "None" })
                  }
                  {
                    (editInvoices.length === 0 || editInvoices[0]._id !== -1) && editInvoices.unshift({ _id: -1, invoice_id: "None" })
                  }
                  {isEdit ? editInvoices.map((invoice, idx) => invoice !== null && <option key={idx} value={invoice._id}>{invoice._id !== -1 && `INV-`}{invoice.invoice_id}</option>) :
                    newInvoices.map((invoice, idx) => <option key={idx} value={invoice._id}>{invoice._id !== -1 && `INV-`}{invoice.invoice_id}</option>)}
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
          <Button variant="primary" className="form-control" onClick={membershipIsEdited ? editMembership : addMembership}>{membershipIsEdited ? 'Edit' : 'Add'} membership</Button>
          <button
            className='btn-close'
            onClick={() => { setMembershipIsOpen(false); onHideMembershipModal() }}
          ></button>
        </Modal.Body>
      </Modal>
      <Modal
        show={invoiceIsOpen}
        onHide={() => setInvoiceIsOpen(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size='lg'
        className='add-modal'
      >
        <Modal.Body className='p-4'>
          <Modal.Title as='h1' className='mb-2'>
            {invoiceIsEdited ? "Edit" : "Add"} invoice
          </Modal.Title>
          <Formik
            validationSchema={validationInvoiceSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={invoiceIsEdited ? onEditInvoice : onAddInvoice}
            initialValues={{
              invoiceIdx: invoiceIdx,
              invoiceId: invoiceIsEdited ? invoices[invoiceIdx]._id : null,
              paidDate: invoiceIsEdited ? moment(invoices[invoiceIdx].paid_date).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD'),
              isPaid: invoiceIsEdited ? (invoices[invoiceIdx].paid_date ? 'paid' : 'notPaid') : 'paid',
              invoiceDescription: invoiceIsEdited ? invoices[invoiceIdx].item_description : '',
              total: invoiceIsEdited ? invoices[invoiceIdx].amount : 0,
            }}
            enableReinitialize={true}
          >
            {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <h2>Tax Invoice</h2>
                <div className='row tax-invoice-container'>
                  <div className='col-lg-6 col-md-6 col-xs-12'>
                    <Form.Group>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>To </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="toName"
                          readOnly
                          value={user.firstName + ' ' + user.lastName}
                          placeholder="Full name"
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>Invoice number </InputGroup.Text>
                        <Form.Control
                          type="text"
                          readOnly
                          name="invocieNumber"
                          value={'INV-' + lastInvoiceNumber}
                          placeholder="invoice number"
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <InputGroup>
                        <InputGroup.Text>Issued</InputGroup.Text>
                        <Form.Control
                          type="date"
                          name="paidDate"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.paidDate}
                          touched={touched}
                          isInvalid={!!errors.paidDate} />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">{errors.paidDate}</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className='col-lg-6 col-md-6 col-xs-12'>
                    <Form.Group>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>From </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="fromName"
                          readOnly
                          value={`AnswerSheet Pty Ltd`}
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>ACN </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="fromName"
                          readOnly
                          value={`665 324 541`}
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <InputGroup>
                        <InputGroup.Text>Paid </InputGroup.Text>
                        <Form.Select
                          name="isPaid"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.isPaid}
                          touched={touched}
                          isInvalid={!!errors.isPaid}>
                          <option value="paid">Paid</option>
                          <option value="notPaid">Not paid</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.isPaid}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </div>
                </div>
                <div className='row tax-invoice-container'>
                  <h2>Description</h2>
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      placeholder="Please enter a description"
                      name="invoiceDescription"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.invoiceDescription}
                      rows="4"
                      touched={touched}
                      isInvalid={!!errors.invoiceDescription}
                    />
                  </Form.Group>
                  <Form.Group>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>Total inc. GST ($)</InputGroup.Text>
                      <Form.Control
                        type="number"
                        name="total"
                        onChange={handleChange}
                        value={values.total}
                        isInvalid={!!errors.total}
                        touched={touched}
                        placeholder="Total"
                        onBlur={handleBlur}
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">{errors.total}</Form.Control.Feedback>
                  </Form.Group>
                  <div className='col-lg-6 col-md-6 col-xs-12'>
                    <Form.Group>
                      <InputGroup className='mb-2'>
                        <InputGroup.Text>GST 10% ($)</InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="gst"
                          onChange={handleChange}
                          value={(values.total / 11).toFixed(2)}
                          touched={touched}
                          placeholder="GST"
                          onBlur={handleBlur}
                          readOnly
                        />
                      </InputGroup>
                    </Form.Group>
                  </div>
                  <div className='col-lg-6 col-md-6 col-xs-12'>
                    <Form.Group>
                      <InputGroup>
                        <InputGroup.Text>Subtotal ($)</InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="subtotal"
                          onChange={handleChange}
                          value={(values.total / 11 * 10).toFixed(2)}
                          placeholder="Subtotal"
                          readOnly
                        />
                      </InputGroup>
                    </Form.Group>
                  </div>
                </div>
                <Button variant="primary" type="submit" className="form-control">{invoiceIsEdited ? 'Edit' : 'Add'} invoice</Button>
              </Form>
            )}
          </Formik>
          <button
            className='btn-close'
            onClick={() => { setInvoiceIsOpen(false); }}
          ></button>
        </Modal.Body>
      </Modal>
      <CModal visible={removeModalIsOpen} onClose={() => setRemoveModalIsOpen(false)}>
        <CModalHeader>
          <CModalTitle><h1>Are you sure?</h1></CModalTitle>
        </CModalHeader>
        <CModalBody>Deleting is permanent and cannot be undone.</CModalBody>
        <CModalFooter>
          <CButton color="primary" ref={autoFocusButtonRef} onClick={removeType === 'invoice' ? () => removeInvoice(removeInvoiceIdx) : () => removeMembership(removeMembershipIdx)}><i className="fa fa-thumbs-up"></i> Delete</CButton>
          <CButton color="danger" onClick={() => setRemoveModalIsOpen(false)}><i className="fa fa-thumbs-down"></i> Cancel</CButton>
        </CModalFooter>
      </CModal>
      <Modal show={invoiceModalOpen} className="view-modal" size="xl" onHide={() => setInvoiceModalOpen(false)}>
        <Modal.Body>
          <Modal.Title>
            <h1>Tax Invoice</h1>
          </Modal.Title>
          <Card className="mb-3">
            <Card.Body>
              <div className="row invoice-content">
                <div className='col-6'>
                  <div className="invoice-to mb-2">
                    <p>
                      <span className='invoice-item-label'>To: </span>
                      <span className='invoice-item-content'>
                        {user.firstName} {user.lastName}
                      </span>
                    </p>
                    <p>
                      <span className='invoice-item-label'>Invoice number: </span>
                      <span className='invoice-item-content'>
                        {"INV-" + invoice.invoice_id}
                      </span>
                    </p>
                    <p>
                      <span className='invoice-item-label'>Issued: </span>
                      <span className='invoice-item-content'>
                        {moment(invoice.paid_date).format("DD/MM/YYYY")}
                      </span>
                    </p>
                    <p>
                      <span className='invoice-item-label'>Status: </span>
                      <span className='invoice-item-content'>
                        {invoice.isPaid ? 'PAID' : 'NOT PAID'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className='col-6'>
                  <div className="invoice-from mb-2">
                    <p>
                      <span className='invoice-item-label'>From: </span>
                      <span className='invoice-item-content'>
                        {invoice.company}
                      </span>
                    </p>
                    <p>
                      <span className='invoice-item-label'>ACN: </span>
                      <span className='invoice-item-content'>
                        {invoice.phone}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="p-4 item-description-container">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="item-description-title">Description</div>
                <div className="item-description-title">
                  <LazyLoadImage src={AmountSvg} alt="Amount" className="me-2" height={18} />
                  Amount
                </div>
              </div>
              <div className="d-flex justify-content-between item-description-content mb-4">
                <div>
                  <p className="mb-1">{invoice.item_name}</p>
                  <p>{invoice.item_description}</p>
                </div>
                <div><i className='fa fa-dollar'></i> <span style={{ fontWeight: '600' }}>{Number(invoice.amount - invoice.gst).toFixed(2)}</span></div>
              </div>
              <div className="invoice-billing-info">
                <div className="invoice-billing-left-info">
                  <div>
                    <div>Subtotal</div>
                    <div><i className='fa fa-dollar'></i> {Number(invoice.amount - invoice.gst).toFixed(2)}</div>
                  </div>
                  <div>
                    <div>GST 10%:</div>
                    <div><i className='fa fa-dollar'></i> {Number(invoice.gst).toFixed(2)}</div>
                  </div>
                </div>
                <div className="invoice-billing-right-info">
                  <div>Total inc. GST</div>
                  <div><i className='fa fa-dollar'></i> {Number(invoice.amount).toFixed(2)}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
          <button
            className='btn-close'
            onClick={() => setInvoiceModalOpen(false)}
          ></button>
        </Modal.Body>
      </Modal>
      <Modal show={membershipModalShow} className="membership-view-modal invoice-view-modal" size="xl" onHide={() => setMembershipModalShow(false)}>
        <Modal.Body>
          <Modal.Title>
            <h3>Current Membership</h3>
          </Modal.Title>
          {
            membershipModalContent && membershipModalContent.subject &&
            <Accordion defaultActiveKey="0" style={{ marginTop: 25 }}>
              <div style={{ display: 'none' }}>
                {
                  taxInvIdx = 0
                }
              </div>
              {
                subjectInvoices.map((invoice, idx) => (
                  invoice.subject_id === membershipModalContent.subject._id &&
                  <div key={idx}>
                    {
                      <Card style={{ marginBottom: 20 }} key={idx}>
                        <Accordion.Item eventKey={`${taxInvIdx ++}`}>
                          <Accordion.Header >
                            {"INV-" + invoice.invoice_id}
                          </Accordion.Header>
                          <Accordion.Body style={{ marginTop: 60 }}>
                            <Card className="mb-3" >
                              <Card.Body>
                                <div className="row invoice-content">
                                  <div className='col-6'>
                                    <div className="invoice-to mb-2">
                                      <p>
                                        <span className='invoice-item-label'>To: </span>
                                        <span className='invoice-item-content'>
                                          {user.firstName} {user.lastName}
                                        </span>
                                      </p>
                                      <p>
                                        <span className='invoice-item-label'>Invoice number: </span>
                                        <span className='invoice-item-content'>
                                          {"INV-" + invoice.invoice_id}
                                        </span>
                                      </p>
                                      <p>
                                        <span className='invoice-item-label'>Issued: </span>
                                        <span className='invoice-item-content'>
                                          {moment(invoice.paid_date).format("DD/MM/YYYY")}
                                        </span>
                                      </p>
                                      <p>
                                        <span className='invoice-item-label'>Status: </span>
                                        <span className='invoice-item-content'>
                                          {invoice.isPaid ? 'PAID' : 'NOT PAID'}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className='col-6'>
                                    <div className="invoice-from mb-2">
                                      <p>
                                        <span className='invoice-item-label'>From: </span>
                                        <span className='invoice-item-content'>
                                          {invoice.company}
                                        </span>
                                      </p>
                                      <p>
                                        <span className='invoice-item-label'>ACN: </span>
                                        <span className='invoice-item-content'>
                                          {invoice.phone}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                            <Card>
                              <Card.Body className="p-4 item-description-container">
                                <div className='row'>
                                  <div className='col-md-9'>
                                    <div className="item-description-title">Description</div>
                                    <p>{invoice.item_description}</p>
                                  </div>
                                  <div className='col-md-3 item-description-title-container'>
                                    <div className="item-description-title">
                                      <LazyLoadImage src={AmountSvg} alt="Amount" className="me-2" height={18} />
                                      Amount
                                    </div>
                                    <div><i className='fa fa-dollar'></i><span style={{ fontWeight: '600' }}>{Number(invoice.amount - invoice.gst).toFixed(2)}</span></div>
                                  </div>
                                </div>
                                <div className="invoice-billing-info">
                                  <div className="invoice-billing-left-info">
                                    <div>
                                      <div>Subtotal</div>
                                      <div><i className='fa fa-dollar'></i>{Number(invoice.amount - invoice.gst).toFixed(2)}</div>
                                    </div>
                                    <div>
                                      <div>GST 10%</div>
                                      <div><i className='fa fa-dollar'></i>{Number(invoice.gst).toFixed(2)}</div>
                                    </div>
                                  </div>
                                  <div className="invoice-billing-right-info">
                                    <div>Total inc. GST</div>
                                    <div><i className='fa fa-dollar'></i>{Number(invoice.amount).toFixed(2)}</div>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Card>
                    }
                  </div>
                ))
              }
            </Accordion>
          }
          {/* <Card className="mb-2">
            <Card.Body>
              <p><b>Invoice: </b> {membershipModalContent.invoice == null ? '' : 'INV-' + (!isEmpty(membershipModalContent) && membershipModalContent.invoice.invoice_id)}</p>
              <hr />
              <p><b>Subjects: </b></p>
              <ul>
                {!isEmpty(membershipModalContent) &&
                  membershipModalContent.subjects.map((subject, idx) => {
                    return <li key={idx}>{subject.year.name} - {subject.name}</li>
                  })
                }
              </ul>
              <hr />
              <p><b>Price: </b>${!isEmpty(membershipModalContent) && membershipModalContent.price}</p>
              <p><b>Current until: </b>{!isEmpty(membershipModalContent) && moment(membershipModalContent.expiredDate).format('DD/MM/YYYY')
              }</p>
            </Card.Body>
          </Card> */}
          <Button className="btn-secondary" onClick={() => setMembershipModalShow(false)}>Close</Button>
          <button
            className='btn-close'
            onClick={() => setMembershipModalShow(false)}
          ></button>
        </Modal.Body>
      </Modal>
    </Row >
  )
}
export default User