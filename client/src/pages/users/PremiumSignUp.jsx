import { useState, useEffect, useRef } from 'react'
import { Container, Form, Row, Col, Table, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Helmet } from "react-helmet";
import { useGoogleLogin } from "@react-oauth/google";
import { setLoading } from '../../store/reducers/userReducer'
import { Formik } from 'formik'
import * as yup from 'yup'
import Http from '../../services/Http'
import FormInput from '../../components/FormInput'
import { toast } from 'react-toastify'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import GoogleSvg from "../../assets/images/svg/google/google.svg";
import SignUpSvg from '../../assets/images/Group-14629.svg'
import VisaSvg from "../../assets/images/visa.svg"
import MasterCardSvg from "../../assets/images/mastercard.svg"
import AmexSvg from "../../assets/images/amex.svg"
import PaypalSvg from "../../assets/images/paypal.svg"
import './PremiumSignUp.css'

const PremiumSignUp = () => {
  const stripeRef = useRef('');
  const paypalRef = useRef('');

  const dispatch = useDispatch()
  const [membership, setMembership] = useState({})
  const [premiumUser, setPremiumUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    paymentType: 'stripe'
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
          title: "AnswerSheet - HSC made easy",
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
        title: "AnswerSheet - HSC made easy",
        viewport: "width=device-width,initial-scale=1",
      })
    });
  }, []);

  useEffect(() => {
    let membershipToPurchase = JSON.parse(
      window.localStorage.getItem('membership')
    )
    let temp = JSON.parse(
      window.localStorage.getItem('premiumUser')
    )
    if (membershipToPurchase) {
      setMembership(membershipToPurchase)
    }
    if (temp) {
      setPremiumUser(temp)
    }
  }, [])

  const validationSchema = yup.object({
    firstName: yup
      .string('Enter your first name.')
      .required('First name is required.'),
    lastName: yup
      .string('Enter your last name.')
      .required('Last name is required.'),
    email: yup
      .string('Enter your email.')
      .email('Enter a vaild email.')
      .required('Email is required.'),
    password: yup
      .string('Enter your password')
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
  const googleRegister = useGoogleLogin({
    onSuccess: async (tokenRes) => {
      let paymentType = '';
      let { data } = await Http.post("premiun-google-register", tokenRes);
      if (data.status) {
        if (stripeRef.current.checked === true) {
          paymentType = 'stripe';
          setPremiumUser({ ...data.user, paymentType: 'stripe' })
        }
        if (paypalRef.current.checked === true) {
          paymentType = 'paypal';
          setPremiumUser({ ...data.user, paymentType: 'paypal' })
        }
        dispatch(setLoading(true));
        window.localStorage.setItem('premiumUser', JSON.stringify(premiumUser));
        window.localStorage.setItem('premiumMembership', JSON.stringify(membership));
        await upgradeMembership({ ...data.user, paymentType: paymentType })
      } else {
        toast.error(data.msg)
      }
      dispatch(setLoading(false))
    },
    onError: errRes => {
      console.log(errRes)
    }
  });
  const onRegister = async (user, { resetForm }) => {

    user.firstName = parseNametoCapital(user.firstName);
    user.lastName = parseNametoCapital(user.lastName);

    window.localStorage.setItem('premiumUser', JSON.stringify(user));
    let { data } = await Http.post('premium-register', user);
    if (data.success) {
      dispatch(setLoading(true));
      window.localStorage.setItem('premiumMembership', JSON.stringify(membership));
      if (data.success) {
        await upgradeMembership({ ...data.user, paymentType: user.paymentType })
      } else {
        toast.error(data.msg)
      }
    } else {
      toast.error(data.msg)
    }
    dispatch(setLoading(false))
  }
  const upgradeMembership = async user => {
    let { data } = await Http.post(`billing/${user.paymentType}`, {
      user,
      membership
    });
    if (data.success) {
      dispatch(setLoading(false))
      window.location.href = data.redirect_url
    } else {
      dispatch(setLoading(false))
      toast.error(data.msg)
    }
  }

  const parseNametoCapital = (name) => {
    // Convert name to lowercase and split into words
    let words = name.toLowerCase().split(/[\s]+/);

    // Capitalize first letter of each word
    for (let i = 0; i < words.length; i++) {
      let subWords = words[i].toLowerCase().split(/[\s-]+/);
      for (let k = 0; k < subWords.length; k++)
        subWords[k] = subWords[k].charAt(0).toUpperCase() + subWords[k].slice(1);

      words[i] = subWords.join('-').charAt(0).toUpperCase() + subWords.join('-').slice(1);
    }

    // Join words with spaces and hyphens and return capitalized name
    return words.join(' ');
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
      <div className='premium-signup-container'>
        <Container>
          <div className='page-content'>
            <div className='page-left-content'>
              <img src={SignUpSvg} alt='Sign Up' />
            </div>
            <div className='page-right-content'>
              <Formik
                validationSchema={validationSchema}
                onSubmit={onRegister}
                initialValues={premiumUser}
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <div style={{ width: '100%' }} className='mb-3'>
                      <h1 className='page-title'>Join Answersheet Premium</h1>
                    </div>

                    {Object.keys(membership).length && (
                      <Table bsPrefix='bg-white table table-bordered'>
                        <thead
                          style={{ backgroundColor: '#005492', color: '#fafafa' }}
                        >
                          <tr>
                            <th>AnswerSheet Premium</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div>
                                {membership.name} - {membership.subjects.length} {membership.subjects.length > 1 ? 'subjects' : 'subject'}
                              </div>
                              <ul className="mb-0">
                                {membership.subjects.map((subject, idx) =>
                                  <li key={idx}>{subject.year_name} - {subject.name}</li>
                                )}
                              </ul>
                            </td>
                            <td>${membership.price}</td>
                          </tr>
                          <tr>
                            <td className='fw-bolder'>Total payment</td>
                            <td>${membership.price}</td>
                          </tr>
                        </tbody>
                      </Table>
                    )}
                    <Form.Group className='mb-3'>
                      <Form.Check
                        inline
                        type='radio'
                        name='paymentType'
                        value='stripe'
                        className="mr-5"
                        label={
                          <>
                            <LazyLoadImage
                              src={VisaSvg}
                              alt='visa'
                              height='36'
                              className='mx-2'
                            />
                            <LazyLoadImage
                              src={MasterCardSvg}
                              alt='mastercard'
                              height='33'
                              className='mx-2'
                            />
                            <LazyLoadImage
                              src={AmexSvg}
                              alt='amex'
                              height='27'
                              className='mx-2'
                            />
                          </>
                        }
                        id='stripe'
                        checked={values.paymentType === 'stripe'}
                        onChange={handleChange}
                        ref={stripeRef}
                      />
                      <Form.Check
                        inline
                        type='radio'
                        name='paymentType'
                        value='paypal'
                        label={
                          <LazyLoadImage
                            src={PaypalSvg}
                            height='45'
                            alt='paypal'
                          />
                        }
                        id='paypal'
                        checked={values.paymentType === 'paypal'}
                        onChange={handleChange}
                        ref={paypalRef}
                      />
                    </Form.Group>
                    <div style={{ width: '100%' }} className='mb-3'>
                      <h1 className='page-title'>Create an account</h1>
                    </div>
                    <div className="d-grid">
                      <Button variant="primary" className="google-signup-btn" type="button" onClick={googleRegister}>
                        <LazyLoadImage src={GoogleSvg} alt="google" /> Sign up with Google and join
                      </Button>
                    </div>
                    <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ flex: 1 }}><hr /></div>
                      <div className="py-2 px-3 fw-bold text-dark">OR</div>
                      <div style={{ flex: 1 }}><hr /></div>
                    </div>
                    <FormInput
                      required
                      name='email'
                      className='mb-4'
                      icon='fa fa-envelope'
                      type='email'
                      placeholder='Email'
                      onChange={handleChange}
                      value={values.email}
                      errors={errors}
                    />
                    <Row>
                      <Col md='6' sm='12'>
                        <FormInput
                          required
                          name='firstName'
                          className='mb-4'
                          icon='fa fa-user'
                          type='text'
                          placeholder='First name'
                          onChange={handleChange}
                          value={values.firstName}
                          errors={errors}
                        />
                      </Col>
                      <Col md='6' sm='12'>
                        <FormInput
                          required
                          name='lastName'
                          className='mb-4'
                          icon='fa fa-user'
                          type='text'
                          placeholder='Last name'
                          onChange={handleChange}
                          value={values.lastName}
                          errors={errors}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6' sm='12'>
                        <FormInput
                          required
                          name='password'
                          className='mb-4'
                          icon='fa fa-lock'
                          type='password'
                          placeholder='Password'
                          onChange={handleChange}
                          value={values.password}
                          errors={errors}
                        />
                      </Col>
                      <Col md='6' sm='12'>
                        <FormInput
                          required
                          name='confirmPassword'
                          className='mb-4'
                          icon='fa fa-check'
                          type='password'
                          placeholder='Confirm password'
                          onChange={handleChange}
                          value={values.confirmPassword}
                          errors={errors}
                        />
                      </Col>
                    </Row>
                    <div className='d-grid'>
                      <Button
                        variant='primary'
                        type='submit'
                        className='float-end'
                      >
                        <i className='fa fa-sign-in'></i> Sign up and join
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default PremiumSignUp
