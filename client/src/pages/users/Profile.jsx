import { useState, useEffect } from 'react'
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Button
} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { createUser } from '../../store/reducers/userReducer'
import { Formik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { Helmet } from "react-helmet";
import Http from '../../services/Http'

const Profile = () => {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user.user)
  const token = useSelector(state => state.user.token)
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  })

  const validationProfileSchema = yup.object({
    firstName: yup.string().required('First name is required.'),
    lastName: yup.string().required('Last name is required.'),
    email: yup
      .string()
      .email('Enter a vaild email.')
      .required('Email is required.')
  })

  const validationPasswordsSchema = yup.object({
    password: yup
      .string()
      .min(8, 'Password should be minimum 8 characters in length.')
      .required('Password is required.'),
    confirmPassword: yup
      .string()
      .test(
        'password-match',
        'Password and Confirm password do not match.',
        function (value) {
          return this.parent.password === value
        }
      )
  })
  const [metadata, setMetadata] = useState({
    author: "",
    description: "",
    keywords: "",
    othername: "",
    othercontent: "",
    slug: "",
    title: "",
    viewport: ""
  });

  useEffect(() => {
    let curUrl = document.location.pathname.slice(1);
    if (curUrl === "")
      curUrl = "home";
    let params = {
      url: curUrl
    };

    Http.post(`/admin/seos/url`, params).then(res => {
      let data = res.data;
      if (data.success && data.data) {
        setMetadata({
          ...metadata,
          author: data.data.author,
          description: data.data.description,
          keywords: data.data.keywords,
          othername: data.data.othername,
          othercontent: data.data.othercontent,
          slug: data.data.slug,
          title: data.data.title,
          viewport: data.data.viewport,
        })
        document.title = data.data.title;
      } else {
        setMetadata({
          ...metadata,
          author: "AnswerSheet",
          description: "AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",
          keywords: "HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",
          othername: "",
          othercontent: "",
          slug: "",
          title: "AnswerSheet - Profile",
          viewport: "width=device-width,initial-scale=1",
        })
      }
    }).catch(err => {
      setMetadata({
        ...metadata,
        author: "AnswerSheet",
        description: "AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",
        keywords: "HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",
        othername: "",
        othercontent: "",
        slug: "",
        title: "AnswerSheet - Profile",
        viewport: "width=device-width,initial-scale=1",
      })
    });
  }, []);

  useEffect(() => {
    setUser(userState)
  }, [userState])

  const updateProfile = async (user, { resetForm }) => {
    let id = user._id
    let { data } = await Http.put(`users/${id}`, user)
    if (data.status) {
      toast.success(data.msg)
      dispatch(
        createUser({
          user: data.data,
          token: token
        })
      )
    } else {
      toast.error(data.msg)
    }
  }

  const updatePassword = async (passwords, { resetForm }) => {
    let { data } = await Http.patch(`users/${user._id}`, {
      password: passwords.password
    });
    if (data.status) {
      resetForm();
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
    }
  }
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="author" content={metadata.author} />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="viewport" content={metadata.viewport} />
        <meta name={metadata.othername} content={metadata.othercontent} />
      </Helmet>
      <Container className='py-3'>
        <Card>
          <Card.Header
            style={{ background: '#3c4b64' }}
            bsPrefix='card-header py-3'
          >
            <Card.Title as='h1' bsPrefix='card-title mb-0 text-light'>
              Profile
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h2 className='mb-3'>Update profile</h2>
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
                            <InputGroup>
                              <InputGroup.Text>
                                <i className='fa fa-user'></i>
                              </InputGroup.Text>
                              <Form.Control
                                type='text'
                                name='firstName'
                                value={values.firstName}
                                readOnly={values.oauth ? true : false}
                                onChange={handleChange}
                                isInvalid={!!errors.firstName}
                                touched={touched}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {errors.firstName}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className='mb-3'>
                            <Form.Label>Last name:</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className='fa fa-user'></i>
                              </InputGroup.Text>
                              <Form.Control
                                type='text'
                                name='lastName'
                                readOnly={values.oauth ? true : false}
                                value={values.lastName}
                                onChange={handleChange}
                                isInvalid={!!errors.lastName}
                                touched={touched}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {errors.lastName}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className='mb-3'>
                            <Form.Label>Email:</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <i className='fa fa-envelope'></i>
                              </InputGroup.Text>
                              <Form.Control
                                type='email'
                                name='email'
                                value={values.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                                touched={touched}
                                readOnly={values.oauth ? true : false}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {errors.email}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                          <Form.Group>
                            <Button
                              type='submit'
                              variant='primary'
                              className='float-end'
                              disabled={values.oauth ? true : false}
                            >
                              <i className='fa fa-save'></i> Update
                            </Button>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Col>
              <Col md={6}>
                {user.oauth === true ? '' : <>
                  <h2 className='mb-3'>Change password</h2>
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
                            name='password'
                            value={values.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                            touched={touched}
                          />
                          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Form.Label>Confirm password:</Form.Label>
                          <Form.Control
                            type='password'
                            name='confirmPassword'
                            value={values.confirmPassword}
                            onChange={handleChange}
                            isInvalid={!!errors.confirmPassword}
                            touched={touched}
                          />
                          <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                        </Form.Group>
                        <Button
                          type='submit'
                          variant='primary'
                          style={{ float: 'right' }}
                        >
                          <i className='fa fa-edit'></i> Change password
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </>
                }
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default Profile
