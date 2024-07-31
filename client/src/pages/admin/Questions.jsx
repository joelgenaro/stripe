import { useState, useEffect, useRef } from "react";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import Http from "../../services/Http";
import QuestionItem from "../../components/admin/QuestonItem";
import { MathJax } from "better-react-mathjax";
import { MathJaxContext } from 'better-react-mathjax';

const Question = () => {
    const mathRef = useRef(0)
    const autoFocusButtonRef = useRef(null);
    const [isGetData, setIsGetData] = useState(false);
    const [data, setData] = useState([]);
    const [sort, setSort] = useState();
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ page: 1, totalCount: 0, pageSize: 10 });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewQuestionItem, setViewQuestionItem] = useState();
    const [question, setQuestion] = useState({
        year: null,
        subject: null,
        module: null,
        topic: null,
        subtopic: null,
        name: "",
        content: "",
        permission: "",
        mark: null
    });

    const columns = [{
        key: "_id",
        name: "No",
        width: "5%",
        render: (rowData, idx) => (pagination.page - 1) * pagination.pageSize + (idx + 1)
    }, {
        key: "year",
        width: "10%",
        name: "Year",
        render: (rowData, idx) => rowData.year.name
    }, {
        key: "subject",
        name: "Subject",
        width: "10%",
        render: (rowData, idx) => rowData.subject.name
    }, {
        key: "modules",
        name: "Module",
        width: "15%",
        render: (rowData, idx) => {
            let module = "";
            let cnt = rowData.modules.length;
            for (let i = 0; i < cnt; i++) {
                if (i !== 0)
                    module = module + ", "
                module = module + rowData.modules[i].name
            }
            return module
        }
    }, {
        key: "topics",
        name: "Topic",
        width: "15%",
        render: (rowData, idx) => {
            let topic = "";
            let cnt = rowData.topics.length;
            for (let i = 0; i < cnt; i++) {
                if (i !== 0)
                    topic = topic + ", "
                topic = topic + rowData.topics[i].name
            }
            return topic
        }
    }, {
        key: "subtopics",
        name: "Subtopic",
        width: "15%",
        render: (rowData, idx) => {
            let subtopic = "";
            let cnt = rowData.subtopics.length;
            for (let i = 0; i < cnt; i++) {
                if (i !== 0)
                    subtopic = subtopic + ", "
                subtopic = subtopic + rowData.subtopics[i].name
            }
            return subtopic
        }
    }, {
        key: "name",
        name: "Question",
        width: "30%",
        render: (rowData, idx) => (
            <MathJax>
                <div
                    ref={mathRef}
                    dangerouslySetInnerHTML={{ __html: split100String(rowData.name) }}
                ></div>
            </MathJax>
        )
    }, {
        key: "action",
        name: "Action",
        render: (rowData, idx) => (
            <div style={{ display: 'flex' }}>
                <Button variant="btn btn-sm btn-outline-success" style={{ marginRight: '0.25rem' }} size="sm" onClick={() => viewQuestion(rowData, idx)}><i className="fa fa-eye"></i></Button>
                <Link className="btn btn-sm btn-outline-primary me-1" to={`/admin/question/edit/${rowData._id}`}>
                    <i className="fa fa-edit"></i>
                </Link>
                <Button variant="btn btn-sm btn-outline-danger" size="sm" onClick={() => removeQuestion(rowData)}><i className="fa fa-trash"></i></Button>
            </div>
        ),
        sortable: false,
    }];

    useEffect(() => {
        (async () => {
            let { data } = await Http.get("admin/questions", {
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

    const split100String = (text) => {
        var regex = "/<(.|\n)*?>/";
        var result = text.replace(regex, "");
        let convertText = result;
        if (result.length >= 100)
            convertText = result.slice(0, 100) + "...";

        return convertText;
    }

    const onChange = ({ search, pagination, sort }) => {
        setSort(sort);
        setSearch(search);
        setPagination(pagination);
        setIsGetData(!isGetData);
    }

    const viewQuestion = (question, idx) => {
        setViewQuestionItem(question);
        setShowViewModal(true);
    }

    const removeQuestion = (question) => {
        setQuestion(question);
        setShowDeleteModal(true);

        setTimeout(() => { autoFocusButtonRef.current.focus() }, 500);
    }

    const deleteQuestion = async () => {
        let { data } = await Http.delete(`admin/questions/${question._id}`);
        if (data.success) {
            setIsGetData(!isGetData);
            setShowDeleteModal(false);
            toast.success(data.msg);
        } else {
            toast.error(data.msg);
        }
    }

    const config = {
        options: {
            enableMenu: false
        }
    };

    return (
        <>
            <MathJaxContext config={config}>
                <Card>
                    <Card.Header
                        style={{ background: '#3c4b64' }}
                        bsPrefix="card-header py-3"
                    >
                        <Card.Title as="h1" bsPrefix="mb-0 card-title text-light">
                            Questions management
                            <Link className="btn btn-primary btn-sm float-end" to={'/admin/question/create'}><i className="fa fa-plus"></i> New question</Link>
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
                                <CButton color="primary" ref={autoFocusButtonRef} onClick={deleteQuestion}><i className="fa fa-thumbs-up"></i> Delete</CButton>
                                <CButton color="danger" onClick={() => setShowDeleteModal(false)}><i className="fa fa-thumbs-down"></i> Cancel</CButton>
                            </CModalFooter>
                        </CModal>
                    </Card.Body>
                </Card>
                <Modal
                    show={showViewModal}
                    onHide={() => setShowViewModal(false)}
                    className="view-modal"
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Body>
                        <Modal.Title>
                            <h1>View question</h1>
                        </Modal.Title>
                        {
                            viewQuestionItem &&
                            <QuestionItem viewQuestionItem={viewQuestionItem} />
                        }
                        <button
                            className="btn-close"
                            style={{ position: "absolute", top: 25, right: 25 }}
                            onClick={() => setShowViewModal(false)}
                        ></button>
                    </Modal.Body>
                </Modal>
            </MathJaxContext>
        </>
    )
}

export default Question;