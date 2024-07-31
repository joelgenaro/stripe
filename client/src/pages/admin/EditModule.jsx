import { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const EditSubject = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [years, setYears] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [module, setModule] = useState({ no: "", year: "", subject: "", name: "", description: "" });
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
            setComboData(data);
        })();
    }, []);

    const setComboData = async (yearData) => {
        // Set Module
        let { id } = params;
        let { data } = await Http.get(`admin/modules/${id}`);
        if (data.status) {
            // Set Years
            setYears(yearData);

            // Set Subjects
            let yearIdx = yearData.findIndex(year => year._id === data.data.subject.year._id);
            setSubjects(yearData[yearIdx].subjects);

            // SetModule
            setModule({
                ...module,
                no: data.data.no,
                year: data.data.subject.year._id,
                subject: data.data.subject._id,
                name: data.data.name,
                description: data.data.description
            });
        } else {
            toast.error(data.msg);
        }
    }

    const onChangeYear = (ev) => {
        let idx = years.findIndex(year => year._id === ev.target.value);

        let lastOrder;
        if (years.length > idx && years[idx].subjects.length > 0 && years[idx].subjects[0].modules.length > 0)
            lastOrder = years[idx].subjects[0].modules[0].no;
        else
            lastOrder = 0;

        setSubjects(years[idx].subjects);
        setModule({
            ...module,
            year: years[idx]._id,
            subject: years[idx].subjects.length ? years[idx].subjects[0]._id : "",
            no: (lastOrder + 1)
        });
    }

    const onChangeSubject = (ev) => {
        let idx = subjects.findIndex(subject => subject._id === ev.target.value);
        let lastOrder;
        if (subjects.length > idx && subjects[idx].modules.length > 0)
            lastOrder = subjects[idx].modules[0].no;
        else
            lastOrder = 0;

        setModule({
            ...module,
            subject: ev.target.value,
            no: (lastOrder + 1)
        });
    }

    const onUpdate = async (module, { resetForm }) => {
        let { id } = params;
        let { data } = await Http.put(`admin/modules/${id}`, module);
        if (data.status) {
            toast.success(data.msg);
            resetForm();
            navigate("/admin/modules");
        } else {
            toast.error(data.msg);
        }
    }

    return (
        <Card>
            <Card.Header style={{ background: '#3c4b64' }} bsPrefix="card-header py-3">
                <Card.Title bsPrefix="card-title mb-0 text-light" as="h1">
                    Edit module
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Formik
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={onUpdate}
                    initialValues={module}
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
                                <Form.Label>Order:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Please enter a module order"
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
                                <Form.Label>Module:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Please enter a module name."
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
                                    placeholder="Please enter a module description."
                                    name="description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    rows={10}
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="float-end"><i className="fa fa-save"></i> Update</Button>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default EditSubject;