import { useState, useEffect } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./CreateSubject.css";

const CreateSubject = () => {
    const navigate = useNavigate();
    const [years, setYears] = useState([]);
    const [subject, setSubject] = useState({ no: "", name: "", year: "", description: "" });
    const validationSchema = yup.object({
        no: yup.number().typeError("Must be a number.")
            .required("Please enter an order.")
            .test("", "Must be between 1 and 99.", function (val) {
                if (!val) val = 0;
                if (val < 1 || val > 99)
                    return false;
                return true;
            }),
        name: yup.string('Enter a subject name.')
            .test('len', 'Must be less than or equal to 64 characters.', function (val) {
                if (!val) val = "";
                return val.length <= 64;
            })
            .required('Please enter a name.')
    })
    useEffect(() => {
        const getYears = async () => {
            let { data } = await Http.get("admin/years/get-all");

            let lastOrder;
            if (data.length > 0 && data[0].subjects.length > 0)
                lastOrder = data[0].subjects[0].no;
            else
                lastOrder = 0;

            setYears(data);
            setSubject({ ...subject, year: data.length ? data[0]._id : "", no: (lastOrder + 1) });
        }
        getYears();
    }, []);

    const onChangeYear = (ev) => {
        let idx = years.findIndex(year => year._id === ev.target.value);

        let lastOrder;
        if (years.length > 0 && years[idx].subjects.length > 0) {
            lastOrder = years[idx].subjects[0].no;
        } else {
            lastOrder = 0;
        }

        setSubject({
            ...subject,
            year: ev.target.value,
            no: (lastOrder + 1)
        });
    }

    const onSave = async (subject, { resetForm }) => {
        let { data } = await Http.post("admin/subjects", subject);
        if (data.status) {
            toast.success(data.msg);
            resetForm();
            navigate("/admin/subjects");
        } else {
            toast.error(data.msg);
        }
    }
    return (
        <Card className="create-subject-container">
            <Card.Header style={{ background: '#3c4b64' }} bsPrefix="card-header py-3">
                <Card.Title bsPrefix="card-title mb-0 text-light" as="h1">
                    New subject
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Formik
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={onSave}
                    initialValues={subject}
                    enableReinitialize
                >
                    {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row>
                                <Col lg={12} md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Year:</Form.Label>
                                        <Form.Select
                                            name="year"
                                            onChange={onChangeYear}
                                            onBlur={handleBlur}
                                            value={values.year}
                                            touched={touched}
                                            isInvalid={!!errors.year}
                                        >
                                            {years.map((year, idx) => <option key={idx} value={year._id}>{year.name}</option>)}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">{errors.year}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Order:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Please enter a subject order."
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
                                        <Form.Label>Subject:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Please enter a subject name."
                                            name="name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                            touched={touched}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Description:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Please enter a subject description"
                                    name="description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    rows="10"
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