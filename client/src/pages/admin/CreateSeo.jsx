import { useState } from 'react'
import { Card, Form, Row, Col, Button } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import Http from '../../services/Http'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const CreateSeo = () => {
    const navigate = useNavigate()
    const [seo, setSeo] = useState({
        slug: '',
        title: 'AnswerSheet - HSC made easy',
        viewport: 'width=device-width,initial-scale=1',
        description: 'AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.',
        keywords: 'HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology',
        author: 'AnswerSheet',
        othername: '',
        othercontent: '',
    })

    const validationSchema = yup.object({
        slug: yup.string('Enter slug.').required('Slug is required.'),
        title: yup.string('Enter title.').required('Title is required.'),
        viewport: yup.string('Enter viewport.').required('Viewport is required.'),
        description: yup.string('Enter description.').required('Description is required.'),
        keywords: yup.string('Enter keywords.').required('Keywords is required.'),
        author: yup.string('Enter author.').required('Author is required.'),
        othername: yup.string('Enter meta name.'),
        othercontent: yup.string('Enter meta content.')
    })

    const onSave = async (seo, { resetForm }) => {
        let { data } = await Http.post('admin/seos', seo)
        if (data.success) {
            toast.success(data.msg)
            resetForm()
            navigate('/admin/seo')
        } else {
            toast.error(data.msg)
        }
    }

    return (
        <Card>
            <Card.Header
                style={{ background: '#3c4b64' }}
                bsPrefix='card-header py-3'
            >
                <Card.Title bsPrefix='card-title mb-0 text-light' as='h1'>
                    New SEO
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Formik
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={onSave}
                    initialValues={seo}
                    enableReinitialize
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        errors
                    }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Slug:</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Please enter slug.'
                                    name='slug'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.slug}
                                    touched={touched}
                                    isInvalid={!!errors.slug}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.slug}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Title:</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Please enter title.'
                                    name='title'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                    touched={touched}
                                    isInvalid={!!errors.title}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.title}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Meta viewport:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Please enter viewport.'
                                            name='viewport'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.viewport}
                                            touched={touched}
                                            isInvalid={!!errors.viewport}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.viewport}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Meta description:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Please enter description.'
                                            name='description'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.description}
                                            touched={touched}
                                            isInvalid={!!errors.description}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Meta keywords:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Please enter keywords.'
                                            name='keywords'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.keywords}
                                            touched={touched}
                                            isInvalid={!!errors.keywords}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.keywords}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Meta author:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Please enter author.'
                                            name='author'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.author}
                                            touched={touched}
                                            isInvalid={!!errors.author}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.author}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Meta name:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Please enter meta name.'
                                            name='othername'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.othername}
                                            touched={touched}
                                            isInvalid={!!errors.othername}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.othername}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Meta content:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Please enter meta content.'
                                            name='othercontent'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.othercontent}
                                            touched={touched}
                                            isInvalid={!!errors.othercontent}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.othercontent}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button type='submit' variant='primary' className='float-end'>
                                <i className='fa fa-save'></i> Save
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default CreateSeo