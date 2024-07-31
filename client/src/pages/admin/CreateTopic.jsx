import { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateSubject = () => {
    const navigate = useNavigate();
    const [years, setYears] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [modules, setModules] = useState([]);
    const [topic, setTopic] = useState({ no: "", year: "", subject: "", module: "", name: "", description: "" });
    const validationSchema = yup.object({
        no: yup.number().typeError("Must be a number.")
            .required("Please enter an order.")
            .test("", "Must be between 1 and 99.", function (val) {
                if (!val) val = 0;
                if (val < 1 || val > 99)
                    return false;
                return true;
            }),
        subject: yup.string('Choose a subject.')
            .required('Subject is required.'),
        module: yup.string('Choose a module')
            .required("Module is required."),
        name: yup.string('Enter a topic name.')
            .test('len', 'Must be less than 64 characters.', function (val) {
                if (!val) val = "";
                return val.length < 64;
            })
            .required('Please enter a name.')
    })
    useEffect(() => {
        (async () => {
            let { data } = await Http.get("admin/years/get-all-populate");

            let lastOrder;
            if (data.length > 0 && data[0].subjects.length > 0 && data[0].subjects[0].modules.length > 0 && data[0].subjects[0].modules[0].topics.length > 0)
                lastOrder = data[0].subjects[0].modules[0].topics[0].no;
            else
                lastOrder = 0;

            setYears(data);
            setSubjects(data.length ? data[0].subjects : []);
            setModules(data.length ? data[0].subjects[0].modules : []);
            setTopic({
                ...topic,
                year: data.length ? data[0]._id : "",
                subject: (data.length && data[0].subjects.length) ? data[0].subjects[0]._id : "",
                module: (data.length && data[0].subjects.length && data[0].subjects[0].modules.length) ? data[0].subjects[0].modules[0]._id : "",
                no: (lastOrder + 1)
            });
        })();
    }, []);

    const onChangeYear = (ev) => {
        let idx = years.findIndex(year => year._id === ev.target.value);

        let lastOrder;
        if (years.length > idx && years[idx].subjects.length > 0 && years[idx].subjects[0].modules.length > 0 && years[idx].subjects[0].modules[0].topics.length > 0)
            lastOrder = years[idx].subjects[0].modules[0].topics[0].no;
        else
            lastOrder = 0;

        setSubjects(years[idx].subjects);
        setModules(years[idx].subjects.length ? years[idx].subjects[0].modules : []);
        setTopic({
            ...topic,
            year: ev.target.value,
            subject: years[idx].subjects.length ? years[idx].subjects[0]._id : "",
            module: years[idx].subjects.length && years[idx].subjects[0].modules.length ? years[idx].subjects[0].modules[0]._id : "",
            no: (lastOrder + 1)
        });
    }

    const onChangeSubject = (ev) => {
        let idx = subjects.findIndex(subject => subject._id === ev.target.value);

        let lastOrder;
        if (subjects.length > idx && subjects[idx].modules.length > 0 && subjects[idx].modules[0].topics.length > 0)
            lastOrder = subjects[idx].modules[0].topics[0].no;
        else
            lastOrder = 0;

        setModules(subjects[idx].modules);
        setTopic({
            ...topic,
            subject: ev.target.value,
            module: subjects[idx].modules.length ? subjects[idx].modules[0]._id : "",
            no: (lastOrder + 1)
        });
    }

    const onChangeModule = (ev) => {
        let idx = modules.findIndex(module => module._id === ev.target.value);

        let lastOrder;
        if (modules.length > idx && modules[idx].topics.length > 0)
            lastOrder = modules[idx].topics[0].no;
        else
            lastOrder = 0;

        setTopic({
            ...topic,
            module: ev.target.value,
            no: (lastOrder + 1)
        });
    }

    const onSave = async (topic, { resetForm }) => {
        let { data } = await Http.post("admin/topics", topic);
        if (data.status) {
            toast.success(data.msg);
            resetForm();
            navigate("/admin/topics");
        } else {
            toast.error(data.msg);
        }
    }

    return (
        <Card>
            <Card.Header style={{ background: '#3c4b64' }} bsPrefix="card-header py-3">
                <Card.Title bsPrefix="card-title mb-0 text-light" as="h1">
                    Create topic
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Formik
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={onSave}
                    initialValues={topic}
                    enableReinitialize
                >
                    {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Year:</Form.Label>
                                <Form.Select
                                    name="year"
                                    value={values.year}
                                    onChange={onChangeYear}
                                    onBlur={handleBlur}
                                    touched={touched}
                                    isInvalid={!!errors.year}
                                >
                                    {years.map((year, idx) => <option key={idx} value={year._id}>{year.name}</option>)}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.year}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Subject:</Form.Label>
                                <Form.Select
                                    name="subject"
                                    value={values.subject}
                                    onChange={onChangeSubject}
                                    onBlur={handleBlur}
                                    touched={touched}
                                    isInvalid={!!errors.subject}
                                >
                                    {subjects.map((subject, idx) => <option key={idx} value={subject._id}>{subject.name}</option>)}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Module:</Form.Label>
                                <Form.Select
                                    name="module"
                                    value={values.module}
                                    onChange={onChangeModule}
                                    onBlur={handleBlur}
                                    touched={touched}
                                    isInvalid={!!errors.module}
                                >
                                    {modules.map((module, idx) => <option key={idx} value={module._id}>{module.name}</option>)}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.module}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Order:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Please enter a topic order."
                                    name="no"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.no}
                                    touched={touched}
                                    isInvalid={!!errors.no}
                                />
                                <Form.Control.Feedback type="invalid">{errors.no}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Topic:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Please enter a topic name."
                                    name="name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    touched={touched}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Please enter a topic description."
                                    name="description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    rows={10}
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="float-end"><i className="fa fa-save"></i> Save</Button>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default CreateSubject;