import { useState, useEffect, useRef } from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import Http from '../../services/Http'
import uploadTinyImage from '../../services/TinyMCE'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'

const EditSubTopic = () => {
  const params = useParams()
  const editorRef = useRef(null)
  const navigate = useNavigate()
  const [onlySave, setOnlySave] = useState(false)
  const [years, setYears] = useState([])
  const [subjects, setSubjects] = useState([])
  const [modules, setModules] = useState([])
  const [topics, setTopics] = useState([])
  const [subTopic, setSubTopic] = useState({
    no: '',
    year: '',
    subject: '',
    module: '',
    topic: '',
    name: '',
    content: '',
    permission: 0
  })
  const validationSchema = yup.object({
    no: yup.number().typeError("Must be a number.")
      .required("Please enter a order.")
      .test("", "Must be between 1 and 99.", function (val) {
        if (!val) val = 0;
        if (val < 1 || val > 99)
          return false;
        return true;
      }),
    year: yup.string('Choose a year.').required('Year is required.'),
    subject: yup.string('Choose a subject.').required('Subject is required'),
    module: yup.string('Choose a module.').required('Module is required.'),
    topic: yup.string('Choose a topic.').required('Topic is required.'),
    name: yup
      .string('Enter a subtopic name.')
      .test(
        'len',
        'Must be less than or equal to 64 characters.',
        function (val) {
          if (!val) val = ''
          return val.length <= 64
        }
      )
      .required('Please enter a name.')
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
      let { data } = await Http.get('/admin/years/get-all-populate')
      setComboData(data);
    })()
  }, [])

  const setComboData = async (yearData) => {
    // Set Module
    let { id } = params;
    let { data } = await Http.get(`admin/sub-topics/${id}`);
    if (data.success) {
      // Set Years
      setYears(yearData);

      // Set Subjects
      let yearIdx = yearData.findIndex(year => year._id === data.data.topic.module.subject.year._id);
      setSubjects(yearData[yearIdx].subjects);

      // Set Modules
      let subjectIdx = yearData[yearIdx].subjects.findIndex(subject => subject._id === data.data.topic.module.subject._id);
      setModules(yearData[yearIdx].subjects[subjectIdx].modules);

      // Set Topics
      let moduleIdx = yearData[yearIdx].subjects[subjectIdx].modules.findIndex(module => module._id === data.data.topic.module._id);
      setTopics(yearData[yearIdx].subjects[subjectIdx].modules[moduleIdx].topics);

      // Set SubTopic
      setSubTopic({
        ...subTopic,
        no: data.data.no,
        year: data.data.topic.module.subject.year._id,
        subject: data.data.topic.module.subject._id,
        module: data.data.topic.module._id,
        topic: data.data.topic._id,
        name: data.data.name,
        content: data.data.content,
        permission: data.data.permission
      })
    } else {
      toast.error(data.msg);
    }
  }

  const onChangeYear = ev => {
    let idx = years.findIndex(year => year._id === ev.target.value)

    let lastOrder;
    if (years.length > idx && years[idx].subjects.length > 0 && years[idx].subjects[0].modules.length > 0 && years[idx].subjects[0].modules[0].topics.length > 0 && years[idx].subjects[0].modules[0].topics[0].subTopics.length > 0) {
      lastOrder = years[idx].subjects[0].modules[0].topics[0].subTopics[0].no;
    }
    else
      lastOrder = 0;

    setSubjects(years[idx].subjects)
    setModules(years[idx].subjects.length ? years[idx].subjects[0].modules : [])
    setTopics(
      years[idx].subjects.length && years[idx].subjects[0].modules.length
        ? years[idx].subjects[0].modules[0].topics
        : []
    )
    setSubTopic({
      ...subTopic,
      year: ev.target.value,
      subject: years[idx].subjects.length ? years[idx].subjects[0]._id : '',
      module:
        years[idx].subjects.length && years[idx].subjects[0].modules.length
          ? years[idx].subjects[0].modules[0]._id
          : '',
      topic:
        years[idx].subjects.length && years[idx].subjects[0].modules.length && years[idx].subjects[0].modules[0].topics.length
          ? years[idx].subjects[0].modules[0].topics[0]._id
          : '',
      no: (lastOrder + 1)
    })
  }

  const onChangeSubject = ev => {
    let idx = subjects.findIndex(subject => subject._id === ev.target.value)
    let lastOrder;
    if (subjects.length > idx && subjects[idx].modules.length > 0 && subjects[idx].modules[0].topics.length > 0 && subjects[idx].modules[0].topics[0].subTopics.length > 0)
      lastOrder = subjects[idx].modules[0].topics[0].subTopics[0].no;
    else
      lastOrder = 0;

    setModules(subjects[idx].modules)
    setTopics(
      subjects[idx].modules.length ? subjects[idx].modules[0].topics : []
    )
    setSubTopic({
      ...subTopic,
      subject: ev.target.value,
      module: subjects[idx].modules.length ? subjects[idx].modules[0]._id : '',
      topic:
        subjects[idx].modules.length && subjects[idx].modules[0].topics.length
          ? subjects[idx].modules[0].topics[0]._id
          : '',
      no: (lastOrder + 1)
    })
  }

  const onChangeModule = ev => {
    let idx = modules.findIndex(module => module._id === ev.target.value)
    let lastOrder;
    if (modules.length > idx && modules[idx].topics.length > 0 && modules[idx].topics[0].subTopics.length > 0)
      lastOrder = modules[idx].topics[0].subTopics[0].no;
    else
      lastOrder = 0;

    setTopics(modules[idx].topics)
    setSubTopic({
      ...subTopic,
      module: ev.target.value,
      topic: modules[idx].topics.length ? modules[idx].topics[0]._id : '',
      no: (lastOrder + 1)
    })
  }

  const onChangeTopic = ev => {
    let idx = topics.findIndex(topic => topic._id === ev.target.value);

    let lastOrder;
    if (topics.length > idx && topics[idx].subTopics.length > 0)
      lastOrder = topics[idx].subTopics[0].no;
    else
      lastOrder = 0;

    setSubTopic({
      ...subTopic,
      topic: ev.target.value,
      no: (lastOrder + 1)
    })
  }

  const onChangePermission = ev => {
    setSubTopic({
      ...subTopic,
      permission: Number(ev.target.value)
    })
  }

  const onUpdate = async (subTopic, { resetForm }) => {
    let { id } = params
    subTopic.content = editorRef.current.getContent()
    let { data } = await Http.put(`admin/sub-topics/${id}`, subTopic)
    if (data.success) {
      toast.success(data.msg)
      resetForm()
      if (onlySave === false)
        navigate('/admin/subtopics')
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
          Edit subtopic
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Formik
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={onUpdate}
          initialValues={subTopic}
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
                <Form.Select
                  name='module'
                  value={values.module}
                  onChange={onChangeModule}
                  onBlur={handleBlur}
                  touched={touched}
                  isInvalid={!!errors.module}
                >
                  {modules.map((module, idx) => (
                    <option key={idx} value={module._id}>
                      {module.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  {errors.module}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Topic:</Form.Label>
                <Form.Select
                  name='topic'
                  value={subTopic.topic}
                  onChange={onChangeTopic}
                  onBlur={handleBlur}
                  touched={touched}
                  isInvalid={!!errors.topic}
                >
                  {topics.map((topic, idx) => (
                    <option key={idx} value={topic._id}>
                      {topic.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>
                  {errors.topic}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Order:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Please enter a subtopic order."
                  name="no"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.no}
                  touched={touched}
                  isInvalid={!!errors.no}
                />
                <Form.Control.Feedback type="invalid">{errors.no}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Please enter a subtopic name.'
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
                      configUrl: '/@dimakorotkov/tinymce-mathjax/config.js',
                      loader: { load: ['ui/lazy'] }
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
                  name='content'
                  initialValue={values.content}
                />
              </Form.Group>
              <Button type='submit' variant='primary' className='float-end' style={{ marginLeft: 8 }} onClick={() => { setOnlySave(false) }}>
                <i className='fa fa-sign-out'></i> Save and exit
              </Button>
              <Button variant='primary' className='float-end' onClick={() => { setOnlySave(true); handleSubmit() }}>
                <i className='fa fa-save'></i> Save
              </Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  )
}

export default EditSubTopic
