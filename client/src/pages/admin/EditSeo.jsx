import { useState, useEffect } from 'react'
import { Card, Form, Row, Col, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import * as yup from 'yup'

import Http from '../../services/Http'

const EditSeo = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [seo, setSeo] = useState({
        slug: '',
        title: '',
        viewport: '',
        description: '',
        keywords: '',
        author: '',
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

    useEffect(() => {
        ; (async () => {
            let { id } = params
            let { data } = await Http.get(`/admin/seos/${id}`)
            if (data.success) {
                setSeo({
                    ...seo,
                    slug: data.data.slug,
                    title: data.data.title,
                    viewport: data.data.viewport,
                    description: data.data.description,
                    keywords: data.data.keywords,
                    author: data.data.author,
                    othername: data.data.othername,
                    othercontent: data.data.othercontent
                })
                document.title = data.data.title;
            } else {
                toast.error(data.msg)
            }
        })()
    }, [])

    const onUpdate = async (seo, { resetForm }) => {
        let { id } = params
        let { data } = await Http.put(`admin/seos/${id}`, seo)
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
                    Edit SEO
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Formik
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={onUpdate}
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
    );
}

export default EditSeo;