import { useState, useEffect } from "react";
import { Formik } from 'formik'
import { Card, Form, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Helmet } from "react-helmet";
import * as yup from 'yup'
import FormInput from '../../components/FormInput'
import Http from '../../services/Http'
import './ResetPassword.css'

const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();
  const passwords = {
    newPassword: '',
    confirmPassword: ''
  }
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

  const validationSchema = yup.object({
    newPassword: yup
      .string('Enter your password.')
      .min(8, 'Password should be minimum 8 characters in length.')
      .required('Password is required.'),
    confirmPassword: yup
      .string('Enter your confirm password.')
      .test('password-match', 'Password and Confirm password do not match.', function (value) {
        return this.parent.newPassword === value
      })
  })

  useEffect(() => {
    const checkResetExpire = async () => {
      let { token } = params;
      let { data } = await Http.get(`verify-expire-time/${token}`);
      if (data.status) {

      } else {
        toast.error(data.msg);
        navigate("/");
      }
    }
    checkResetExpire()
  }, []);

  const onRestPassword = async (passwords, { resetForm }) => {
    let { newPassword: password } = passwords;
    let { token } = params;
    let { data } = await Http.post('reset-password', {
      password, token
    });
    if (data.status) {
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
    }
    navigate("/");
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
      <div className='reset-password-container'>
        <Card style={{ flexBasis: 450 }}>
          <Card.Body className='px-5 py-5'>
            <Card.Title as='h3' className='mb-4 text-center'>
              Reset password
            </Card.Title>
            <Formik
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={onRestPassword}
              initialValues={passwords}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <FormInput
                    required
                    name='newPassword'
                    className='mb-4'
                    icon='fa fa-key'
                    type='password'
                    placeholder='New password'
                    onChange={handleChange}
                    value={values.newPassword}
                    touched={touched}
                    errors={errors}
                  />
                  <FormInput
                    required
                    name='confirmPassword'
                    className='mb-4'
                    icon='fa fa-lock'
                    type='password'
                    placeholder='Confirm password'
                    onChange={handleChange}
                    value={values.confirmPassword}
                    touched={touched}
                    errors={errors}
                  />
                  <div className='d-grid'>
                    <Button type='submit' variant='primary'>
                      Reset
                    </Button>
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

export default ResetPassword
