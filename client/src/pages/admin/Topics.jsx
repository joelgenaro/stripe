import { useState, useEffect, useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import Http from "../../services/Http";
import "./Topics.css";

const Topics = () => {
    const autoFocusButtonRef = useRef(null);
    const [isGetData, setIsGetData] = useState(0);
    const [data, setData] = useState([]);
    const [sort, setSort] = useState();
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ no: "", page: 1, totalCount: 0, pageSize: 10 });
    const [topic, setTopic] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const columns = [{
        key: "no",
        name: "No",
        width: '5%',
        render: (rowData, idx) => (pagination.page - 1) * pagination.pageSize + (idx + 1)
    }, {
        key: "no",
        name: "Order",
        width: '10%',
        render: (rowData, idx) => rowData.no
    }, {
        key: "name",
        name: "Name",
        width: '15%',
    }, {
        key: "year",
        name: "Year",
        render: (rowData, idx) => rowData.module.subject.year.name,
        width: '10%',
    }, {
        key: "subject",
        name: "Subject",
        render: (rowData, idx) => rowData.module.subject.name,
        width: '10%',
    }, {
        key: "module",
        name: "Module",
        render: (rowData, idx) => rowData.module.name,
        width: '15%',
    }, {
        key: "description",
        name: "Description",
        width: '20%',
        render: (rowData, idx) => <div className="topic-description" dangerouslySetInnerHTML={{ __html: rowData.description }}></div>,
        sortable: false
    }, {
        key: "action",
        name: "Action",
        width: '15%',
        render: (rowData, idx) => (
            <div>
                <Link className="btn btn-sm btn-outline-success me-1" to={`/admin/topics/edit/${rowData._id}`}>
                    <i className="fa fa-edit"></i>
                </Link>
                <Button variant="btn btn-sm btn-outline-danger" size="sm" onClick={() => removeTopic(rowData)}><i className="fa fa-trash"></i></Button>
            </div>
        ),
        sortable: false
    }];

    useEffect(() => {
        const getTopics = async () => {
            let { data } = await Http.get("admin/topics", {
                params: {
                    search: search,
                    length: pagination.pageSize,
                    page: pagination.page,
                    sortKey: sort ? sort.key : "",
                    sortDir: sort ? sort.dir : ""
                }
            });
            setData(data.data);
            setPagination({ ...pagination, totalCount: data.totalCount });
        }
        getTopics();
    }, [isGetData]);

    const onChange = ({ search, pagination, sort }) => {
        setSort(sort);
        setSearch(search);
        setPagination(pagination);
        setIsGetData(!isGetData);
    }
    const removeTopic = (topic) => {
        setTopic(topic);
        setShowDeleteModal(true);

        setTimeout(() => { autoFocusButtonRef.current.focus() }, 500);
    }
    const deleteTopic = async () => {
        let { data } = await Http.delete(`admin/topics/${topic._id}`);
        if (data.status) {
            setIsGetData(!isGetData);
            setShowDeleteModal(false);
            toast.success(data.msg);
        } else {
            toast.error(data.msg);
        }
    }
    return (
        <Card>
            <Card.Header style={{ background: '#3c4b64' }} bsPrefix="card-header py-3">
                <Card.Title as="h1" bsPrefix="card-title text-light mb-0" style={{ fontSize: 24 }}>
                    Topics management
                    <Link to="/admin/topics/create" className="btn btn-primary btn-sm float-end">
                        <i className="fa fa-plus"></i> New topic
                    </Link>
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
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>
                    <CModalTitle><h1>Are you sure?</h1></CModalTitle>
                </CModalHeader>
                <CModalBody>Deleting is permanent and cannot be undone.</CModalBody>
                <CModalFooter>
                    <CButton color="primary" ref={autoFocusButtonRef} onClick={deleteTopic}><i className="fa fa-thumbs-up"></i> Delete</CButton>
                    <CButton color="danger" onClick={() => setShowDeleteModal(false)}><i className="fa fa-thumbs-down"></i> Cancel</CButton>
                </CModalFooter>
            </CModal>
        </Card>
    )
}

export default Topics;