import { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import { useSelector } from 'react-redux'
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import TopicIcon from "../../assets/images/topic_icon.svg";
import QuestionList from "../../components/users/QuestionList";
import "./SubTopics.css";

const SubTopics = () => {
    const params = useParams();
    const navigate = useNavigate();
    const user = useSelector(store => store.user.user)
    const [topic, setTopic] = useState({});
    const [superRole, setSuperRole] = useState(0);
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
        window.scrollTo(0, 0);
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
        const getTopic = async () => {
            let { year, subject, module, topic } = params;
            let { data } = await Http.get(`topics/get-topic-by-slug`, {
                params: {
                    year_slug: year,
                    subject_slug: subject,
                    module_slug: module,
                    topic_slug: topic
                }
            });
            if (data.success) {
                setTopic(data.data);
                setQuestions(data.questions);
            } else {
                toast.error(data.msg);
                navigate(`/subjects`);
            }
        }
        getTopic();
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
            <div className="sub-topics-container">
                <Container>
                    <Card className="mb-4">
                        <Card.Body className="pt-5 px-5 pb-4">
                            <h1 className="topic-title">{topic.name}</h1>
                            {topic.description && <p>{topic.description}</p>}
                            <div className="sub-topic-list">
                                {
                                    topic.subTopics && topic.subTopics.map((topic, idx) => (
                                        <div className="d-grid" key={idx}>
                                            <Link className="btn btn-primary learn-btn" to={`/${params.year}/${params.subject}/${params.module}/${params.topic}/${topic.slug}`}>
                                                <img src={TopicIcon} alt="Icon" /> <span>{topic.name}</span>
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

export default SubTopics;