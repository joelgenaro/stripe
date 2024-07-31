import { useState, useEffect, useRef } from "react";
import Http from "../../services/Http";
import { Card, Modal, Button } from "react-bootstrap";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import DataTable from "../../components/DataTable";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const autoFocusButtonRef = useRef(null);
    const [isGetData, setIsGetData] = useState(0);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState();
    const [pagination, setPagination] = useState({ page: 1, totalCount: 0, pageSize: 10 });
    const [userId, setUserId] = useState(0);
    const [status, setStatus] = useState(1);
    const [visibleConfirmStatus, setVisibleConfirmStatus] = useState(false);
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
        key: "action",
        name: "Action",
        render: (rowData) => {
            return (
                <div>
                    <Button variant="outline-success"
                        data-tip="Edit"
                        key="1" size="sm"
                        className="me-1"
                        onClick={() => navigate(`/admin/users/${rowData._id}`)}
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
            let { data } = await Http.get("admin/users", {
                params: {
                    search,
                    length: pagination.pageSize,
                    page: pagination.page,
                    sortKey: sort ? sort.key : "",
                    sortDir: sort ? sort.dir : ""
                }
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

    const changeStatus = (id, status) => {
        setUserId(id);
        setStatus(status);
        setVisibleConfirmStatus(true);
    }

    const updateStatus = async () => {
        let { data } = await Http.put(`admin/users/${userId}`, {
            status
        });
        if (data.success) {
            toast.success(data.msg);
            setIsGetData(!isGetData);
            setVisibleConfirmStatus(false);
        } else {
            toast.error(data.msg);
        }
    }

    const removeUser = (id) => {
        setUserId(id);
        setVisibleDeleteUser(true);

        setTimeout(() => { autoFocusButtonRef.current.focus() }, 500);
    }

    const deleteUser = async (id) => {
        let { data } = await Http.delete(`admin/users/${userId}`);
        if (data.status) {
            toast.success(data.msg);
            setIsGetData(!isGetData);
            setVisibleDeleteUser(false)
        }
    }

    const loginMng = async (id) => {
        let result = await Http.put(`/admin/users/login-mng/${id}`);
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

    return (
        <Card>
            <Card.Header style={{ background: '#3c4b64' }} bsPrefix="card-header py-3">
                <Card.Title as="h1" bsPrefix="mb-0 card-title text-light" style={{ fontSize: 24 }}>Users management</Card.Title>
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
                show={visibleConfirmStatus}
                onHide={() => setVisibleConfirmStatus(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you really going to change the user's status?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => updateStatus()}>Yes</Button>
                    <Button variant="danger" onClick={() => setVisibleConfirmStatus(false)}>No</Button>
                </Modal.Footer>
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
        </Card>
    );

}

export default Users;