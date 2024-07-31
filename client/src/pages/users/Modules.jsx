import { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux'
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { Link, useParams, useNavigate } from "react-router-dom";
import TopicIcon from "../../assets/images/topic_icon.svg";
import QuestionList from "../../components/users/QuestionList";
import "./Topics.css";

const Modules = () => {
    const params = useParams();
    const navigate = useNavigate();
    const user = useSelector(store => store.user.user)
    const [superRole, setSuperRole] = useState(0);
    const [subject, setSubject] = useState({});
    const [questions, setQuestions] = useState([]);
    const [metadata, setMetadata] = useState({
        author: "",
        description: "",
        keywords: "",
        othername: "",
        othercontent: "",
        slug: "",
        title: "",
        viewport: ""
    });

    useEffect(() => {
        let curUrl = document.location.pathname.slice(1);
        if (curUrl === "")
            curUrl = "home";
        let params = {
            url: curUrl
        };

        Http.post(`/admin/seos/url`, params).then(res => {
            let data = res.data;
            if (data.success && data.data) {
                setMetadata({
                    ...metadata,
                    author: data.data.author,
                    description: data.data.description,
                    keywords: data.data.keywords,
                    othername: data.data.othername,
                    othercontent: data.data.othercontent,
                    slug: data.data.slug,
                    title: data.data.title,
                    viewport: data.data.viewport,
                })
                document.title = data.data.title;
            } else {
                setMetadata({
                    ...metadata,
                    author: "AnswerSheet",
                    description: "AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",
                    keywords: "HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",
                    othername: "",
                    othercontent: "",
                    slug: "",
                    title: "AnswerSheet - HSC made easy",
                    viewport: "width=device-width,initial-scale=1",
                })
            }
        }).catch(err => {
            setMetadata({
                ...metadata,
                author: "AnswerSheet",
                description: "AnswerSheet has HSC study guides, practice questions and exams to help you achieve a band 6 in your HSC subjects. We have syllabus summaries, practice HSC exam-style questions, and sample answers to show you how to write band 6 responses.",
                keywords: "HSC notes, HSC study guides, syllabus summaries, dot point notes, HSC summaries, HSC English, HSC Physics, HSC maths, HSC Chemistry, HSC Biology",
                othername: "",
                othercontent: "",
                slug: "",
                title: "AnswerSheet - HSC made easy",
                viewport: "width=device-width,initial-scale=1",
            })
        });
    }, []);

    useEffect(() => {
        ; (async () => {
            let { year, subject } = params;

            if (user._id) {
                let access = await Http.get('check-membership-slug', {
                    params: {
                        user: user._id,
                        yearSlug: year,
                        subjectSlug: subject
                    }
                })

                if (access.data.result === true)
                    setSuperRole(2);
                else
                    setSuperRole(1);
            } else
                setSuperRole(0);
        })()
    }, [])

    useEffect(() => {
        (async () => {
            let { year, subject } = params;
            let { data } = await Http.get(`subjects/get-subject-by-slug`, {
                params: {
                    year_slug: year,
                    subject_slug: subject
                }
            });
            if (data.status) {
                setSubject(data.data);
                setQuestions(data.questions);
            } else {
                toast.error(data.msg);
                navigate("/subjects");
            }
        })();
    }, []);

    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
                <meta name="author" content={metadata.author} />
                <meta name="description" content={metadata.description} />
                <meta name="keywords" content={metadata.keywords} />
                <meta name="viewport" content={metadata.viewport} />
                <meta name={metadata.othername} content={metadata.othercontent} />
            </Helmet>
            <div className="topics-container">
                <Container>
                    <Card className="mb-4">
                        <Card.Body className="pt-5 px-5 pb-4">
                            <h1 className="subject-title">{subject.name}</h1>
                            {subject.description && <p>{subject.description}</p>}
                            <div className="topic-list">
                                {
                                    subject.modules && subject.modules.map((module, idx) => (
                                        <div className="d-grid" key={idx}>
                                            <Link className="btn btn-primary learn-btn" to={`/${params.year}/${params.subject}/${module.slug}`}>
                                                <img src={TopicIcon} alt="Icon" /> <span>{module.name}</span>
                                            </Link>
                                        </div>
                                    ))
                                }
                            </div>
                        </Card.Body>
                    </Card>
                    <QuestionList questions={questions} superRole={superRole} />
                </Container>
            </div>
        </>
    )
}

export default Modules;