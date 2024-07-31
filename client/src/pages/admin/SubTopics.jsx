import { useState, useEffect, useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import Http from "../../services/Http";
import "./SubTopics.css";

const SubTopics = () => {
    const autoFocusButtonRef = useRef(null);
    const [isGetData, setIsGetData] = useState(0);
    const [data, setData] = useState([]);
    const [sort, setSort] = useState();
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ page: 1, totalCount: 0, pageSize: 10 });
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
        width: '15%',
        name: "Name",
    }, {
        key: "permission",
        name: "Access",
        width: '10%',
        render: (rowData, idx) => rowData.permission === 0 ? 'Open' : (rowData.permission === 1 ? 'Free' : 'Premium')
    }, {
        key: "year",
        name: "Year",
        width: '10%',
        render: (rowData, idx) => rowData.topic.module.subject.year.name
    }, {
        key: "subject",
        name: "Subject",
        width: '10%',
        render: (rowData, idx) => rowData.topic.module.subject.name
    }, {
        key: "module",
        name: "Module",
        width: '15%',
        render: (rowData, idx) => rowData.topic.module.name
    }, {
        key: "topic",
        name: "Topic",
        width: '15%',
        render: (rowData, idx) => rowData.topic.name,
    }, {
        key: "action",
        name: "Action",
        width: '10%',
        render: (rowData, idx) => (
            <div>
                <Link className="btn btn-sm btn-outline-success me-1" to={`/admin/subtopics/edit/${rowData._id}`}>
                    <i className="fa fa-edit"></i>
                </Link>
                <Button variant="btn btn-sm btn-outline-danger" size="sm" onClick={() => removeSubTopic(rowData)}><i className="fa fa-trash"></i></Button>
            </div>
        ),
        sortable: false,
        width: 90
    }];
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [subTopic, setSubTopic] = useState({});

    useEffect(() => {
        const getSubTopics = async () => {
            let { data } = await Http.get("admin/sub-topics", {
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
        getSubTopics();
    }, [isGetData]);

    const onChange = ({ search, pagination, sort }) => {
        setSort(sort);
        setSearch(search);
        setPagination(pagination);
        setIsGetData(!isGetData);
    }

    const removeSubTopic = (subTopic) => {
        setSubTopic(subTopic);
        setShowDeleteModal(true);
        setTimeout(() => { autoFocusButtonRef.current.focus() }, 500);
    }

    const deleteSubTopic = async () => {
        let { data } = await Http.delete(`admin/sub-topics/${subTopic._id}`);
        if (data.success) {
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
                    Subtopics management
                    <Link className="btn btn-primary btn-sm float-end" to={'/admin/subtopics/create'}><i className="fa fa-plus"></i> New subtopic</Link>
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <DataTable
                    columns={columns}
                    data={data}
                    sort={sort}
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
                    <CButton color="primary" ref={autoFocusButtonRef} onClick={deleteSubTopic}><i className="fa fa-thumbs-up"></i> Delete</CButton>
                    <CButton color="danger" onClick={() => setShowDeleteModal(false)}><i className="fa fa-thumbs-down"></i> Cancel</CButton>
                </CModalFooter>
            </CModal>
        </Card>
    )
}

export default SubTopics;