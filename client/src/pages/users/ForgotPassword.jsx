import { useState, useEffect } from "react";
import { Formik } from 'formik'
import { Card, Form, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet";
import * as yup from 'yup'
import FormInput from '../../components/FormInput'
import Http from "../../services/Http";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  let user = {
    email: ''
  }
  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Email is invalid.')
      .required('Email is required field.')
  });
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

  const onVerifyEmail = async (user, { resetForm }) => {
    let { data } = await Http.post("forgot-password", user);
    if (data.status) {
      toast.success(data.msg);
    } else {
      toast.success(data.msg);
    }
    resetForm();
  }

  return (<>
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="author" content={metadata.author} />
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      <meta name="viewport" content={metadata.viewport} />
      <meta name={metadata.othername} content={metadata.othercontent} />
    </Helmet>
    <div className='forgot-password-container'>
      <Card style={{ flexBasis: 450 }}>
        <Card.Body className="px-5 py-5">
          <Card.Title as="h3" className="mb-3 text-center">Forgot password</Card.Title>
          <p className="text-center">Please enter your email address and we will send you instructions on how to reset your password.</p>
          <Formik
            validationSchema={validationSchema}
            onSubmit={onVerifyEmail}
            initialValues={user}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <FormInput
                  required
                  name='email'
                  className='mb-4'
                  icon='fa fa-envelope'
                  type='email'
                  placeholder='Please enter your email.'
                  onChange={handleChange}
                  value={values.email}
                  touched={touched}
                  errors={errors}
                />
                <div className="d-grid">
                  <Button type="submit" variant="primary">Submit</Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  </>
  )
}

export default ForgotPassword
