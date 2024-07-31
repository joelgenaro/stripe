import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { toast } from 'react-toastify'
import { Formik } from 'formik'
import { Container, Card, Row, Col, Nav, Form, Button } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import Http from '../../services/Http'
import * as yup from 'yup'
import PhoneIcon from '../../assets/images/sms.svg'
import DiscordIcon from '../../assets/images/discord.svg'
import EmailIcon from '../../assets/images/chat.svg'
import SkypeIcon from '../../assets/images/fb_messanger.svg'
import './ContactUs.css'

const ContactUs = () => {
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
          title: "AnswerSheet - Contact Us",
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
        title: "AnswerSheet - Contact Us",
        viewport: "width=device-width,initial-scale=1",
      })
    });
  }, []);

  const navigate = useNavigate()
  let contact = { name: '', email: '', message: '', enquiryNature: 'sales' }
  const validationSchema = yup.object({
    name: yup.string('Enter your name.').required('Name is required.'),
    email: yup
      .string('Enter your email.')
      .email('Enter a valid email.')
      .required('Email is required.'),
    acceptPrivacyPolicy: yup
      .bool()
      .oneOf([true], 'Accept Privacy & Policy is required.')
  })
  const onSendMessage = async (contact, { resetForm }) => {
    try {
      let { data } = await Http.post('message', {
        name: contact.name,
        email: contact.email,
        message: contact.message,
        enquiryNature: contact.enquiryNature
      })
      if (data.success) {
        toast.success(data.data.msg)
        resetForm()
        navigate('/confirm-contact');
      } else {
        toast.error(data.data.msg)
      }
    } catch (err) {
      toast.error(err.getMessage())
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
      <div className='contact-us-container'>
        <Container>
          <Row>
            <Col lg={6} md={12}>
              <Card>
                <h1 className='page-title'>Message us</h1>
                <Card.Body>
                  <div className='contact-list'>
                    <Nav className='flex-column'>
                      <Nav.Item>
                        <Nav.Link href='#'>
                          <LazyLoadImage src={PhoneIcon} alt='sms' /> 0411444111
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link href='#'>
                          <LazyLoadImage src={DiscordIcon} alt='discord' />{' '}
                          0411444111
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link href='#'>
                          <LazyLoadImage src={EmailIcon} alt='email' />{' '}
                          AnswerSheet
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link href='#'>
                          <LazyLoadImage src={SkypeIcon} alt='fbmassenger' />{' '}
                          Message us
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link href='#'>
                          <small style={{ fontSize: 14 }}>
                            We endeavour to reply with 1 business day, most of the
                            time sooner.
                          </small>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} md={12}>
              <Card>
                <h1 className='page-title'>Email us</h1>
                <Card.Body>
                  <Formik
                    validationSchema={validationSchema}
                    onSubmit={onSendMessage}
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={contact}
                  >
                    {({
                      handleSubmit,
                      handleChange,
                      handleBlur,
                      values,
                      touched,
                      errors
                    }) => (
                      <Form
                        className='contact-us-form'
                        noValidate
                        onSubmit={handleSubmit}
                      >
                        <Row gutter={10}>
                          <Col md={4}>
                            <Form.Group className='mb-4'>
                              <Form.Control
                                type='text'
                                placeholder='Your name'
                                name='name'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                touched={touched}
                                isInvalid={!!errors.name}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {errors.name}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='mb-4'>
                              <Form.Control
                                type='email'
                                placeholder='Reply email'
                                name='email'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                touched={touched}
                                isInvalid={!!errors.email}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {errors.email}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='mb-4'>
                              <Form.Select
                                as="select"
                                name='enquiryNature'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.enquiryNature}
                                touched={touched}
                                isInvalid={!!errors.enquiryNature}
                              >
                                <option value="sales">Sales</option>
                                <option value="tech">Tech support</option>
                                <option value="other">Other</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={8}>
                            <Form.Group className='mb-4'>
                              <Form.Control
                                as='textarea'
                                placeholder='Your message'
                                rows={7}
                                name='message'
                                value={values.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                style={{ minHeight: 'calc(12.3rem)' }}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <div className='d-grid mt-2 mb-3'>
                              <Button variant='primary' type='submit'>
                                Submit
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default ContactUs
