import { useState, useEffect, useRef } from "react";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, Button } from "react-bootstrap";
import DataTable from "../../components/DataTable";
import Http from "../../services/Http";

const Seo = () => {
    const autoFocusButtonRef = useRef(null);
    const [isGetData, setIsGetData] = useState(false);
    const [data, setData] = useState([]);
    const [sort, setSort] = useState();
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ page: 1, totalCount: 0, pageSize: 10 });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [seo, setSeo] = useState({
        title: "",
        description: "",
        keywords: "",
        author: "",
        summary: "",
        other: ""
    })

    const columns = [{
        key: "_id",
        name: "No",
        width: 50,
        render: (rowData, idx) => (pagination.page - 1) * pagination.pageSize + (idx + 1)
    }, {
        key: "slug",
        name: "Slug",
        render: (rowData, idx) => <Link to={`/${rowData.slug}`}>{rowData.slug}</Link>
    }, {
        key: "title",
        name: "Title",
        render: (rowData, idx) => {
            return rowData.title
        }
    }, {
        key: "description",
        name: "Description",
        render: (rowData, idx) => rowData.description
    }, {
        key: "keywords",
        name: "keywords",
        render: (rowData, idx) => rowData.keywords
    }, {
        key: "author",
        name: "Author",
        render: (rowData, idx) => rowData.author
    }, {
        key: "action",
        name: "Action",
        render: (rowData, idx) => (
            <div>
                <Link className="btn btn-sm btn-outline-success me-1" to={`/admin/seo/edit/${rowData._id}`}>
                    <i className="fa fa-edit"></i>
                </Link>
                <Button variant="btn btn-sm btn-outline-danger" size="sm" onClick={() => removeSeo(rowData)}><i className="fa fa-trash"></i></Button>
            </div>
        ),
        sortable: false,
        width: 90
    }];

    useEffect(() => {
        (async () => {
            let { data } = await Http.get("admin/seos", {
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
        })();
    }, [isGetData]);

    const onChange = ({ search, pagination, sort }) => {
        setSort(sort);
        setSearch(search);
        setPagination(pagination);
        setIsGetData(!isGetData);
    }

    const removeSeo = (seo) => {
        setSeo(seo);
        setShowDeleteModal(true);
        setTimeout(() => { autoFocusButtonRef.current.focus() }, 500);
    }

    const deleteSeo = async () => {
        let { data } = await Http.delete(`admin/seos/${seo._id}`);
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
            <Card.Header
                style={{ background: '#3c4b64' }}
                bsPrefix="card-header py-3"
            >
                <Card.Title as="h1" bsPrefix="mb-0 card-title text-light">
                    SEO management
                    <Link className="btn btn-primary btn-sm float-end" to={'/admin/seo/create'}><i className="fa fa-plus"></i> New SEO</Link>
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
                <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <CModalHeader>
                        <CModalTitle><h1>Are you sure?</h1></CModalTitle>
                    </CModalHeader>
                    <CModalBody>Deleting is permanent and cannot be undone.</CModalBody>
                    <CModalFooter>
                        <CButton color="primary" ref={autoFocusButtonRef} onClick={deleteSeo}><i className="fa fa-thumbs-up"></i> Delete</CButton>
                        <CButton color="danger" onClick={() => setShowDeleteModal(false)}><i className="fa fa-thumbs-down"></i> Cancel</CButton>
                    </CModalFooter>
                </CModal>
            </Card.Body>
        </Card>
    )
}

export default Seo;