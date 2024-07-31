import { useState, useEffect, useRef } from 'react'
import { Card, Form, Button, Row, Col } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import Http from '../../services/Http'
import uploadTinyImage from '../../services/TinyMCE'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'
import TagsInput from 'react-tagsinput'

const CreateQuestion = () => {
    const editorRef = useRef(null)
    const editorRefName = useRef(null)
    const editorRefCriteria = useRef(null)
    const editorRefSolution = useRef(null)

    const navigate = useNavigate()

    const [refresh, setRefresh] = useState(false)
    const [years, setYears] = useState([])
    const [subjects, setSubjects] = useState([])
    const [modules, setModules] = useState([])
    const [topics, setTopics] = useState([])
    const [subTopics, setSubTopics] = useState([])
    const [question, setQuestion] = useState({
        year: '',
        subject: '',
        modules: [],
        topics: [],
        subtopics: [],
        name: '',
        content: '',
        permission: 2,
        totalMarks: 0,
        syllabusRef: "",
        markingCrit: "",
        sampleSolution: "",
        tags: []
    })
    const validationSchema = yup.object({
        year: yup.string('Choose a year.').required('Year is required.'),
        subject: yup.string('Choose a subject.').required('Subject is required'),
        totalMarks: yup.number('Total marks must be number.').required('Total marks is required.'),
        syllabusRef: yup.string('Enter a syllabus reference.').required('Syllabus reference is required.'),
    })

    useEffect(() => {
        setInterval(() => {
          let len = document.getElementsByClassName('tox-textarea').length;
          if (len > 0) {
            for (let i = 0; i < len; i ++)
            document.getElementsByClassName('tox-textarea')[i].rows = "7";
          }
        }, 200);
        
        ; (async () => {
            let { data } = await Http.get('/admin/questions/parents')

            if (data.years.length && data.years[0].subjects.length) {
                for (let i in data.modules) {
                    if (data.modules[i].subject === data.years[0].subjects[0]._id)
                        data.modules[i].shown = true;
                }
            }

            setYears(data.years)
            setSubjects(data.years.length ? data.years[0].subjects : [])
            setModules(data.modules);
            setTopics(data.topics);
            setSubTopics(data.subtopics);
            setQuestion({
                ...question,
                year: data.years.length ? data.years[0]._id : '',
                subject:
                    data.years.length && data.years[0].subjects.length ? data.years[0].subjects[0]._id : '',
                modules: [],
                topics: [],
                subtopics: []
            });
        })()
    }, [])

    const onChangeYear = ev => {
        let idx = years.findIndex(year => year._id === ev.target.value);

        // Init All Module, Topic, SubTopic's checkbox status.
        for (let i in modules) {
            modules[i].checked = false;
            modules[i].shown = false;

            // If module is selected subject's module then show it.
            if (modules[i].subject === years[idx].subjects[0]._id)
                modules[i].shown = true;
        }
        for (let i in topics) {
            topics[i].checked = false;
            topics[i].shown = false;
        }
        for (let i in subTopics) {
            subTopics[i].checked = false;
            subTopics[i].shown = false;
        }

        setSubjects(years[idx].subjects)
        setModules(modules);
        setTopics(topics);
        setSubTopics(subTopics);

        setQuestion({
            ...question,
            year: ev.target.value,
            subject: years[idx].subjects.length ? years[idx].subjects[0]._id : '',
            modules: [],
            topics: [],
            subtopics: []
        })
    }

    const onChangeSubject = ev => {
        // Init All Module, Topic, SubTopic's checkbox status.
        for (let i in modules) {
            modules[i].checked = false;
            modules[i].shown = false;

            // If module is selected subject's module then show it.
            if (modules[i].subject === ev.target.value)
                modules[i].shown = true;
        }
        for (let i in topics) {
            topics[i].checked = false;
            topics[i].shown = false;
        }
        for (let i in subTopics) {
            subTopics[i].checked = false;
            subTopics[i].shown = false;
        }

        setModules(modules);
        setTopics(topics);
        setSubTopics(subTopics);
        setQuestion({
            ...question,
            subject: ev.target.value,
            modules: [],
            topics: [],
            subtopics: []
        })
    }

    const onChangeModule = ev => {
        let idx = modules.findIndex(module => module._id === ev.target.value)
        modules[idx].checked = ev.target.checked;

        for (let i in topics) {
            if (topics[i].module === modules[idx]._id) {
                if (ev.target.checked)
                    topics[i].shown = true;
                else {
                    topics[i].shown = false;

                    for (let j in subTopics) {
                        if (subTopics[j].topic === topics[i]._id) {
                            subTopics[j].shown = false;
                            subTopics[j].checked = false;
                        }
                    }
                }
                topics[i].checked = false;
            }
        }

        let checkedModules = [];
        for (let i in modules) {
            if (modules[i].checked)
                checkedModules.push(modules[i]._id);
        }

        let checkedTopics = [];
        for (let i in topics) {
            if (topics[i].checked)
                checkedTopics.push(topics[i]._id);
        }

        let checkedSubTopics = [];
        for (let i in subTopics) {
            if (subTopics[i].checked)
                checkedSubTopics.push(subTopics[i]._id);
        }

        setModules(modules);
        setTopics(topics);
        setSubTopics(subTopics);
        setRefresh(!refresh);
        setQuestion({
            ...question,
            modules: checkedModules,
            topics: checkedTopics,
            subtopics: checkedSubTopics
        })
    }

    const onChangeTopic = ev => {
        let idx = topics.findIndex(topic => topic._id === ev.target.value)
        topics[idx].checked = ev.target.checked;

        for (let i in subTopics) {
            if (subTopics[i].topic === topics[idx]._id) {
                if (ev.target.checked) subTopics[i].shown = true;
                else subTopics[i].shown = false;
                subTopics[i].checked = false;
            }
        }

        let checkedTopics = [];
        for (let i in topics) {
            if (topics[i].checked)
                checkedTopics.push(topics[i]._id);
        }

        let checkedSubTopics = [];
        for (let i in subTopics) {
            if (subTopics[i].checked)
                checkedSubTopics.push(subTopics[i]._id);
        }

        setTopics(topics);
        setSubTopics(subTopics);
        setRefresh(!refresh);
        setQuestion({
            ...question,
            topics: checkedTopics,
            subtopics: checkedSubTopics
        })
    }

    const onChangeSubTopic = ev => {
        let idx = subTopics.findIndex(subTopic => subTopic._id === ev.target.value)
        subTopics[idx].checked = ev.target.checked;

        let checkedSubTopics = [];
        for (let i in subTopics) {
            if (subTopics[i].checked)
                checkedSubTopics.push(subTopics[i]._id);
        }

        setSubTopics(subTopics);
        setRefresh(!refresh);
        setQuestion({
            ...question,
            subtopics: checkedSubTopics
        })
    }

    const onChangePermission = ev => {
        setQuestion({
            ...question,
            permission: Number(ev.target.value)
        })
    }

    const onChangeSyllRef = ev => {
        setQuestion({
            ...question,
            syllabusRef: ev.target.value
        })
    }

    const onChangeTotalMark = ev => {
        setQuestion({
            ...question,
            totalMarks: ev.target.value
        })
    }

    const onChangeTag = (tags) => {
        if (tags.length !== 0) {
            var lastTag = tags[tags.length - 1]
            if (lastTag.length > 30) {
                toast.error('Tag length can not be more than 30 characters.');
                return;
            }
        }
        setQuestion({
            ...question,
            tags
        })
    }

    const onSave = async (question, { resetForm }) => {
        question.content = editorRef.current.getContent()
        question.name = editorRefName.current.getContent()
        question.markingCrit = editorRefCriteria.current.getContent()
        question.sampleSolution = editorRefSolution.current.getContent()

        let { data } = await Http.post('admin/questions', question)
        if (data.success) {
            toast.success(data.msg)
            resetForm()
            navigate('/admin/question')
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
                    New Question
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Formik
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={onSave}
                    initialValues={question}
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
                            <Row>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Year:</Form.Label>
                                        <Form.Select
                                            name='year'
                                            value={values.year}
                                            onChange={onChangeYear}
                                            onBlur={handleBlur}
                                            touched={touched}
                                            isInvalid={!!errors.year}
                                        >
                                            {years.map((year, idx) => (
                                                <option key={idx} value={year._id}>
                                                    {year.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.year}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Subject:</Form.Label>
                                        <Form.Select
                                            name='subject'
                                            value={values.subject}
                                            onChange={onChangeSubject}
                                            onBlur={handleBlur}
                                            touched={touched}
                                            isInvalid={!!errors.subject}
                                        >
                                            {subjects.map((subject, idx) => (
                                                <option key={idx} value={subject._id}>
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.subject}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Module:</Form.Label>
                                        <br />
                                        <Row>
                                            {
                                                modules.map((module, idx) => (
                                                    module.shown &&
                                                    <Col sm={6}
                                                        key={idx}>
                                                        <Form.Check
                                                            inline
                                                            label={module.name}
                                                            name="module-item"
                                                            value={module._id}
                                                            type='checkbox'
                                                            id={`module-${module._id}`}
                                                            checked={module.checked}
                                                            className="checkbox-module"
                                                            onChange={onChangeModule}
                                                        />
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Topic:</Form.Label>
                                        <br />
                                        <Row>
                                            {
                                                topics.map((topic, idx) => (
                                                    topic.shown &&
                                                    <Col sm={6}
                                                        key={idx}>
                                                        <Form.Check
                                                            inline
                                                            label={topic.name}
                                                            name="module-item"
                                                            value={topic._id}
                                                            type='checkbox'
                                                            checked={topic.checked}
                                                            id={`topic-${topic._id}`}
                                                            onChange={onChangeTopic}
                                                        />
                                                    </Col>))
                                            }
                                        </Row>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>SubTopic:</Form.Label>
                                        <br />
                                        <Row>
                                            {
                                                subTopics.map((subTopic, idx) => (
                                                    subTopic.shown &&
                                                    <Col sm={6}
                                                        key={idx}>
                                                        <Form.Check
                                                            inline
                                                            label={subTopic.name}
                                                            name="module-item"
                                                            value={subTopic._id}
                                                            type='checkbox'
                                                            checked={subTopic.checked}
                                                            id={`subTopic-${subTopic._id}`}
                                                            onChange={onChangeSubTopic}
                                                        />
                                                    </Col>))
                                            }
                                        </Row>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Check
                                            inline
                                            type='radio'
                                            name='permission'
                                            label='Open'
                                            id='permission-1'
                                            value='0'
                                            checked={values.permission === 0}
                                            onChange={onChangePermission}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Check
                                            inline
                                            type='radio'
                                            name='permission'
                                            label='Free'
                                            id='permission-2'
                                            value='1'
                                            checked={values.permission === 1}
                                            onChange={onChangePermission}
                                            onBlur={handleBlur}
                                        />
                                        <Form.Check
                                            inline
                                            type='radio'
                                            name='permission'
                                            label='Premium'
                                            id='permission-3'
                                            value='2'
                                            checked={values.permission === 2}
                                            onChange={onChangePermission}
                                            onBlur={handleBlur}
                                        />
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Question:</Form.Label>
                                        <Editor
                                            tinymceScriptSrc={
                                                process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'
                                            }
                                            onInit={(ev, editor) => (editorRefName.current = editor)}
                                            init={{
                                                height: 150,
                                                menubar: false,
                                                selector: 'textarea',  // change this value according to your HTML
                                                block_unsupported_drop: false,
                                                automatic_uploads: true,
                                                file_picker_callback: (callback, value, meta) => {
                                                    // Provide file and text for the link dialog
                                                    if (meta.filetype === 'file') {
                                                        callback('mypage.html', { text: 'My text' });
                                                    }

                                                    // Provide image and alt text for the image dialog
                                                    if (meta.filetype === 'image') {
                                                        callback('myimage.jpg', { alt: 'My alt text' });
                                                    }

                                                    // Provide alternative source and posted for the media dialog
                                                    if (meta.filetype === 'media') {
                                                        callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
                                                    }
                                                },
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime media table paste code help wordcount',
                                                    'grid',
                                                    'tiny_mce_wiris',
                                                    'code',
                                                    'table',
                                                    'link',
                                                    'media',
                                                    'codesample'
                                                ],
                                                external_plugins: {
                                                    'mathjax': process.env.PUBLIC_URL + '/@dimakorotkov/tinymce-mathjax/plugin.min.js'
                                                },
                                                toolbar:
                                                    'undo redo | formatselect | ' +
                                                    'bold italic backcolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                                    'removeformat | grid_insert | help | image | mathjax',
                                                mathjax: {
                                                    lib: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js',
                                                    configUrl: '/@dimakorotkov/tinymce-mathjax/config.js'
                                                },
                                                images_upload_handler: uploadTinyImage,
                                                images_upload_credentials: true, // enable sending cookies with the request
                                                paste_data_images: true, // enable pasting images
                                                paste_as_text: true, // paste as plain text
                                                paste_enable_default_filters: false, // disable default filters
                                                paste_postprocess: (plugin, args) => {
                                                    const images = args.node.querySelectorAll('img');
                                                    // do something with the pasted images
                                                },
                                                draggable_modal: true,
                                                content_style:
                                                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                            }}
                                            name='description'
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Total marks:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Please enter total marks.'
                                            name='totalMarks'
                                            onChange={onChangeTotalMark}
                                            onBlur={handleBlur}
                                            value={values.totalMarks}
                                            touched={touched}
                                            isInvalid={!!errors.totalMarks}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.totalMarks}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Syllabus reference:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Please enter syllabus reference.'
                                            name='syllabusRef'
                                            onChange={onChangeSyllRef}
                                            onBlur={handleBlur}
                                            value={values.syllabusRef}
                                            touched={touched}
                                            isInvalid={!!errors.syllabusRef}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.syllabusRef}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Marking criteria:</Form.Label>
                                        <Editor
                                            tinymceScriptSrc={
                                                process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'
                                            }
                                            onInit={(ev, editor) => (editorRefCriteria.current = editor)}
                                            init={{
                                                height: 150,
                                                menubar: false,
                                                selector: 'textarea',  // change this value according to your HTML
                                                block_unsupported_drop: false,
                                                automatic_uploads: true,
                                                file_picker_callback: (callback, value, meta) => {
                                                    // Provide file and text for the link dialog
                                                    if (meta.filetype === 'file') {
                                                        callback('mypage.html', { text: 'My text' });
                                                    }

                                                    // Provide image and alt text for the image dialog
                                                    if (meta.filetype === 'image') {
                                                        callback('myimage.jpg', { alt: 'My alt text' });
                                                    }

                                                    // Provide alternative source and posted for the media dialog
                                                    if (meta.filetype === 'media') {
                                                        callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
                                                    }
                                                },
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime media table paste code help wordcount',
                                                    'grid',
                                                    'tiny_mce_wiris',
                                                    'code',
                                                    'table',
                                                    'link',
                                                    'media',
                                                    'codesample'
                                                ],
                                                external_plugins: {
                                                    'mathjax': process.env.PUBLIC_URL + '/@dimakorotkov/tinymce-mathjax/plugin.min.js'
                                                },
                                                toolbar:
                                                    'undo redo | formatselect | ' +
                                                    'bold italic backcolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                                    'removeformat | grid_insert | help | image | mathjax',
                                                mathjax: {
                                                    lib: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js',
                                                    configUrl: '/@dimakorotkov/tinymce-mathjax/config.js'
                                                },
                                                images_upload_handler: uploadTinyImage,
                                                images_upload_credentials: true, // enable sending cookies with the request
                                                paste_data_images: true, // enable pasting images
                                                paste_as_text: true, // paste as plain text
                                                paste_enable_default_filters: false, // disable default filters
                                                paste_postprocess: (plugin, args) => {
                                                    const images = args.node.querySelectorAll('img');
                                                    // do something with the pasted images
                                                },
                                                draggable_modal: true,
                                                content_style:
                                                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                            }}
                                            name='description'
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.markingCrit}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Sample solution:</Form.Label>
                                        <Editor
                                            tinymceScriptSrc={
                                                process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'
                                            }
                                            onInit={(ev, editor) => (editorRefSolution.current = editor)}
                                            init={{
                                                height: 150,
                                                menubar: false,
                                                selector: 'textarea',  // change this value according to your HTML
                                                block_unsupported_drop: false,
                                                automatic_uploads: true,
                                                file_picker_callback: (callback, value, meta) => {
                                                    // Provide file and text for the link dialog
                                                    if (meta.filetype === 'file') {
                                                        callback('mypage.html', { text: 'My text' });
                                                    }

                                                    // Provide image and alt text for the image dialog
                                                    if (meta.filetype === 'image') {
                                                        callback('myimage.jpg', { alt: 'My alt text' });
                                                    }

                                                    // Provide alternative source and posted for the media dialog
                                                    if (meta.filetype === 'media') {
                                                        callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
                                                    }
                                                },
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime media table paste code help wordcount',
                                                    'grid',
                                                    'tiny_mce_wiris',
                                                    'code',
                                                    'table',
                                                    'link',
                                                    'media',
                                                    'codesample'
                                                ],
                                                external_plugins: {
                                                    'mathjax': process.env.PUBLIC_URL + '/@dimakorotkov/tinymce-mathjax/plugin.min.js'
                                                },
                                                toolbar:
                                                    'undo redo | formatselect | ' +
                                                    'bold italic backcolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                                    'removeformat | grid_insert | help | image | mathjax',
                                                mathjax: {
                                                    lib: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js',
                                                    configUrl: '/@dimakorotkov/tinymce-mathjax/config.js'
                                                },
                                                images_upload_handler: uploadTinyImage,
                                                images_upload_credentials: true, // enable sending cookies with the request
                                                paste_data_images: true, // enable pasting images
                                                paste_as_text: true, // paste as plain text
                                                paste_enable_default_filters: false, // disable default filters
                                                paste_postprocess: (plugin, args) => {
                                                    const images = args.node.querySelectorAll('img');
                                                    // do something with the pasted images
                                                },
                                                draggable_modal: true,
                                                content_style:
                                                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                            }}
                                            name='description'
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.sampleSolution}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Tags:</Form.Label>
                                        <TagsInput value={question.tags} onChange={onChangeTag} />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.tags}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className='mb-3'>
                                <Form.Label>Description:</Form.Label>
                                <Editor
                                    tinymceScriptSrc={
                                        process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'
                                    }
                                    onInit={(ev, editor) => (editorRef.current = editor)}
                                    init={{
                                        height: 450,
                                        menu: {
                                            edit: { title: 'Edit', items: 'undo redo | cut copy | selectall | searchreplace' },
                                        },
                                        selector: 'textarea',  // change this value according to your HTML
                                        block_unsupported_drop: false,
                                        automatic_uploads: true,
                                        file_picker_callback: (callback, value, meta) => {
                                            // Provide file and text for the link dialog
                                            if (meta.filetype === 'file') {
                                                callback('mypage.html', { text: 'My text' });
                                            }

                                            // Provide image and alt text for the image dialog
                                            if (meta.filetype === 'image') {
                                                callback('myimage.jpg', { alt: 'My alt text' });
                                            }

                                            // Provide alternative source and posted for the media dialog
                                            if (meta.filetype === 'media') {
                                                callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
                                            }
                                        },
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount',
                                            'grid',
                                            'tiny_mce_wiris',
                                            'code',
                                            'table',
                                            'link',
                                            'media',
                                            'codesample'
                                        ],
                                        external_plugins: {
                                            'mathjax': process.env.PUBLIC_URL + '/@dimakorotkov/tinymce-mathjax/plugin.min.js'
                                        },
                                        toolbar:
                                            'undo redo | formatselect | ' +
                                            'bold italic backcolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | grid_insert | help | image | mathjax',
                                        mathjax: {
                                            lib: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js',
                                            configUrl: '/@dimakorotkov/tinymce-mathjax/config.js'
                                        },
                                        images_upload_handler: uploadTinyImage,
                                        images_upload_credentials: true, // enable sending cookies with the request
                                        paste_data_images: true, // enable pasting images
                                        paste_as_text: true, // paste as plain text
                                        paste_enable_default_filters: false, // disable default filters
                                        paste_postprocess: (plugin, args) => {
                                            const images = args.node.querySelectorAll('img');
                                            // do something with the pasted images
                                        },
                                        draggable_modal: true,
                                        content_style:
                                            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    }}
                                    name='description'
                                />
                            </Form.Group>
                            <Button type='submit' variant='primary' className='float-end'>
                                <i className='fa fa-save'></i> Save
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card >
    )
}
export default CreateQuestion
