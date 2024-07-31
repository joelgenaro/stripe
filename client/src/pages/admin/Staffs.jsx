import { useState, useEffect, useRef } from "react";
import Http from "../../services/Http";
import { useNavigate } from "react-router-dom";
import { Card, Modal, Button, Form, InputGroup } from "react-bootstrap";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import DataTable from "../../components/DataTable";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import './Staffs.css';

const Staffs = () => {
    const autoFocusButtonRef = useRef(null);
    const [isGetData, setIsGetData] = useState(0);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState();
    const [pagination, setPagination] = useState({ page: 1, totalCount: 0, pageSize: 10 });
    const [staffId, setStaffId] = useState(0);
    const staff = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        status: true,
        isSendInstructions: true
    };

    const validationProfileSchema = yup.object({
        firstName: yup.string().required('First name is required.'),
        lastName: yup.string().required('Last name is required.'),
        email: yup
            .string()
            .email('Enter a vaild email.')
            .required('Email is required.'),
        password: yup
            .string()
            .required('Password is required.')
            .min(8, 'Password should be minimum 8 characters in length.')
    })

    const [visibleNewModal, setVisibleNewModal] = useState(false);
    const [visibleDeleteUser, setVisibleDeleteUser] = useState(false);

    const columns = [{
        key: "_id",
        name: "No",
        width: 65,
        render: (rowData, idx) => (pagination.page - 1) * pagination.pageSize + (idx + 1)
    }, {
        key: "firstName",
        name: "First name"
    }, {
        key: "lastName",
        name: "Last name",
    }, {
        key: "email",
        name: "Email"
    }, {
        key: "role",
        name: "Role"
    }, {
        key: "action",
        name: "Action",
        width: 120,
        render: (rowData) => {
            return (
                <div>
                    <Button variant="outline-success"
                        data-tip="Edit"
                        key="1" size="sm"
                        className="me-1"
                        onClick={() => navigate(`/admin/staff/${rowData._id}`)}
                    >
                        <i className="fa fa-edit"></i>
                    </Button>
                    <Button variant="outline-primary"
                        data-tip={rowData.status ? 'Disable' : 'Enable'}
                        key="2" size="sm"
                        className="me-1"
                        onClick={() => { loginMng(rowData._id) }}
                    >
                        {
                            rowData.status ? <i className="fa fa-thumbs-up"></i> : <i className="fa fa-thumbs-down"></i>
                        }
                    </Button>
                    <Button variant="outline-danger"
                        data-tip="Delete"
                        key="3" size="sm"
                        onClick={() => removeUser(rowData._id)}><i className="fa fa-trash"></i></Button>
                    <ReactTooltip />
                </div>
            )
        },
        sortable: false
    }];

    useEffect(() => {
        const getUsers = async () => {
            let { data } = await Http.get("admin/staffs", {
                params: {
                    search,
                    length: pagination.pageSize,
                    page: pagination.page,
                    sortKey: sort ? sort.key : "",
                    sortDir: sort ? sort.dir : ""
                }
            });
            data.data.map((datum, idx) => {
                if (datum.role === 1) datum.role = 'staff';
                else datum.role = 'admin';
            });
            setData(data.data);
            setPagination({ ...pagination, totalCount: data.totalCount });
        }
        getUsers();
    }, [isGetData]);

    const onChange = ({ search, pagination, sort }) => {
        setSort(sort);
        setSearch(search);
        setPagination(pagination);
        setIsGetData(!isGetData);
    }

    const generatePassword = () => {
        var length = 12,
            charset = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()0123456789",
            password = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password
    }

    const parseNametoCapital = (name) => {
        // Convert name to lowercase and split into words
        let words = name.toLowerCase().split(/[\s]+/);
        
        // Capitalize first letter of each word
        for (let i = 0; i < words.length; i++) {
            let subWords = words[i].toLowerCase().split(/[\s-]+/);
            for (let k = 0; k < subWords.length; k ++)
                subWords[k] = subWords[k].charAt(0).toUpperCase() + subWords[k].slice(1);

            words[i] = subWords.join('-').charAt(0).toUpperCase() + subWords.join('-').slice(1);
        }

        // Join words with spaces and hyphens and return capitalized name
        return words.join(' ');
    }

    const createStaff = async (staff, { resetForm }) => {
        setVisibleNewModal(false);

        staff.role = 1;
        staff.firstName = parseNametoCapital(staff.firstName);
        staff.lastName = parseNametoCapital(staff.lastName);
        let { data } = await Http.post(`admin/staffs`, {
            staff: staff
        })
        if (data.status) {
            resetForm();
            toast.success(data.msg)
        } else {
            toast.error(data.msg)
        }
        setIsGetData(!isGetData);
    }

    const loginMng = async (id) => {
        let result = await Http.put(`admin/staffs/login-mng/${id}`);
        if (result.data.status) {
            toast.success(result.data.msg);
            const newData = data.map((c, i) => {
                if (c._id === id) {
                    c.status = c.status ? false : true;
                    return c;
                } else {
                    return c;
                }
            });
            setData(newData);
        } else {
            toast.error(result.data.msg, "Warning!");
        }
    }

    const removeUser = (id) => {
        setStaffId(id);
        setVisibleDeleteUser(true);

        setTimeout(() => { autoFocusButtonRef.current.focus() }, 500);
    }

    const deleteUser = async (id) => {
        let { data } = await Http.delete(`admin/staffs/${staffId}`);
        if (data.status) {
            toast.success(data.msg);
            setIsGetData(!isGetData);
            setVisibleDeleteUser(false)
        } else {
            toast.error(data.msg);
        }
    }

    return (
        <Card>
            <Card.Header style={{ background: '#3c4b64' }} bsPrefix="card-header py-3">
                <Card.Title as="h1" bsPrefix="mb-0 card-title text-light" style={{ fontSize: 24 }}>
                    Staff management
                    <Button variant="primary" size="sm" className="float-end" onClick={() => setVisibleNewModal(true)}><i className="fa fa-plus"></i> New staff</Button>
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <DataTable
                    columns={columns}
                    data={data}
                    sort={sort}
                    search={search}
                    pagination={pagination}
                    onChange={onChange}
                />
            </Card.Body>
            <Modal
                size="md"
                show={visibleNewModal}
                onHide={() => setVisibleNewModal(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Formik
                    enableReinitialize={true}
                    validationSchema={validationProfileSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={createStaff}
                    initialValues={staff}
                >
                    {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Modal.Header closeButton>
                                <Modal.Title><h1>New staff</h1></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group className='mb-3'>
                                    <Form.Label>First name:</Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='firstName'
                                        onChange={handleChange}
                                        value={values.firstName}
                                        isInvalid={!!errors.firstName}
                                        touched={touched}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.firstName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Last name:</Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='lastName'
                                        onChange={handleChange}
                                        value={values.lastName}
                                        isInvalid={!!errors.lastName}
                                        touched={touched}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.lastName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        type='email'
                                        name='email'
                                        onChange={handleChange}
                                        value={values.email}
                                        isInvalid={!!errors.email}
                                        touched={touched}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>New password:</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            name="password"
                                            onChange={handleChange}
                                            value={values.password}
                                            isInvalid={!!errors.password}
                                        />
                                        <Button variant="outline-primary"
                                            onClick={() => {
                                                setFieldValue('password', generatePassword(), true)
                                            }}>
                                            Generate
                                        </Button>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                    <label>
                                        <Field type="checkbox" name="isSendInstructions" />
                                        &nbsp;&nbsp;&nbsp;Send sign-in instructions
                                    </label>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    type='submit'
                                    variant="primary">Create</Button>
                                <Button variant="danger" onClick={() => setVisibleNewModal(0)}><i className="fa fa-times"></i> Cancel</Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
            <CModal visible={visibleDeleteUser} onClose={() => setVisibleDeleteUser(false)}>
                <CModalHeader>
                    <CModalTitle><h1>Are you sure?</h1></CModalTitle>
                </CModalHeader>
                <CModalBody>Deleting is permanent and cannot be undone.</CModalBody>
                <CModalFooter>
                    <CButton color="primary" ref={autoFocusButtonRef} onClick={() => deleteUser()}><i className="fa fa-thumbs-up"></i> Delete</CButton>
                    <CButton color="danger" onClick={() => setVisibleDeleteUser(false)}><i className="fa fa-thumbs-down"></i> Cancel</CButton>
                </CModalFooter>
            </CModal>
        </Card >
    );

}

export default Staffs;