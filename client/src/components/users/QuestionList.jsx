import { MathJax } from "better-react-mathjax";
import { useState, useRef } from "react";
import { Card, Accordion, Button, Modal } from "react-bootstrap";
import { MathJaxContext } from 'better-react-mathjax';
import "./QuestionList.css";

const QuestionList = (props) => {
    const { questions, superRole } = props;

    const mathRef = useRef(0)

    const [isMarkCrit, setIsMarkCrit] = useState(false);
    const [isSampleSolution, setIsSampleSolution] = useState(false);
    const [markCriteria, setMarkCriteria] = useState("");
    const [sampleSolution, setSampleSolution] = useState("");

    const genLabelName = (idx) => {
        let labelNo = idx % 12;
        if (labelNo === 0) return 'label-default';
        if (labelNo === 1) return 'label-primary';
        if (labelNo === 2) return 'label-info';
        else if (labelNo === 3) return 'label-success';
        else if (labelNo === 4) return 'label-danger';
        else if (labelNo === 5) return 'label-warning';
        else if (labelNo === 6) return 'label-purple';
        else if (labelNo === 7) return 'label-dark-blue';
        else if (labelNo === 8) return 'label-dark-yellow';
        else if (labelNo === 9) return 'label-dark-green';
        else if (labelNo === 10) return 'label-dark-red';
        else if (labelNo === 11) return 'label-light-red';
    }

    const onMarkingCriteriaBtn = (markingCrit) => {
        setIsMarkCrit(true)
        setMarkCriteria(markingCrit)
    }

    const onSampleSolutionBtn = (sampleSol) => {
        setIsSampleSolution(true)
        setSampleSolution(sampleSol);
    }

    const config = {
        options: {
            enableMenu: false
        }
    };

    return <>
        <MathJaxContext config={config}>
            <div className="quesion-field">
                <Accordion defaultActiveKey="0">
                    {
                        questions.map((question, idx) => (
                            <div key={idx}>
                                {
                                    superRole >= question.permission &&
                                    <Card style={{ marginBottom: 20 }} key={idx}>
                                        <Accordion.Item eventKey={idx}>
                                            <Accordion.Header >
                                                <MathJax>
                                                    <div
                                                        ref={mathRef}
                                                        dangerouslySetInnerHTML={{ __html: question.name }}
                                                    ></div>
                                                </MathJax>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <dl className="action-button-container">
                                                    <dt><p><b>Total marks: </b> {question.totalMarks}</p></dt>
                                                    <dt className="mt-3"><p><b>Syllabus reference: </b> {question.syllabusRef}</p></dt>
                                                    <dt className="mt-3">
                                                        <Button variant='outline-primary' size="sm" onClick={() => onMarkingCriteriaBtn(question.markingCrit)} style={{ width: '100%' }}>
                                                            Marking criteria
                                                        </Button>
                                                    </dt>
                                                    <dt className="mt-3">
                                                        <Button variant='outline-danger' size="sm" onClick={() => onSampleSolutionBtn(question.sampleSolution)} style={{ width: '100%' }}>
                                                            Sample solution
                                                        </Button>
                                                    </dt>
                                                    <div className="mt-3">
                                                        {question.tags.map((tag, key) => (
                                                            <span className={`label ${genLabelName(key)}`} style={{ marginRight: 3 }} key={key}> {tag}</span>
                                                        ))}
                                                    </div>
                                                </dl>
                                                <MathJax>
                                                    <div
                                                        ref={mathRef}
                                                        className='mt-3 lecture-content'
                                                        dangerouslySetInnerHTML={{ __html: question.content }}
                                                    ></div>
                                                </MathJax>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Card>
                                }
                            </div>
                        ))
                    }
                </Accordion>
                <Modal
                    show={isMarkCrit}
                    className="view-modal"
                    size="xl"
                    onHide={() => setIsMarkCrit(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Body>
                        <Modal.Title>
                            <h1>Marking criteria</h1>
                        </Modal.Title>
                        <Card className="mb-3">
                            <Card.Body>
                                <div
                                    ref={mathRef}
                                    dangerouslySetInnerHTML={{ __html: markCriteria }}
                                ></div>
                            </Card.Body>
                        </Card>
                        <button
                            className='btn-close'
                            onClick={() => setIsMarkCrit(false)}
                        ></button>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={isSampleSolution}
                    className="view-modal"
                    size="xl"
                    onHide={() => setIsSampleSolution(false)}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Body>
                        <Modal.Title>
                            <h1>Sample solution</h1>
                        </Modal.Title>
                        <Card className="mb-3">
                            <Card.Body>
                                <div
                                    ref={mathRef}
                                    dangerouslySetInnerHTML={{ __html: sampleSolution }}
                                ></div>
                            </Card.Body>
                        </Card>
                        <button
                            className='btn-close'
                            onClick={() => setIsSampleSolution(false)}
                        ></button>
                    </Modal.Body>
                </Modal>
            </div>
        </MathJaxContext>
    </>
}

export default QuestionList;