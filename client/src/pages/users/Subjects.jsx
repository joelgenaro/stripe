import { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Http from "../../services/Http";

import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SubjectIcon from "../../assets/images/subject_icon.svg";
import "./Subjects.css";

const Subjects = () => {
    const [years, setYears] = useState([]);
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
        (async () => {
            let { data } = await Http.get("years");
            if (data.success) {
                setYears(data.data);
            } else {
                toast.error(data.msg);
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
            <div className="subjects-container">
                <Container>
                    {
                        years.map((year, idx) => (
                            <Card className="mb-4" key={idx}>
                                <Card.Body className="pt-4 pt-sm-4 pt-md-5 pt-3 px-sm-4 px-md-5  pb-3 pb-sm-4">
                                    <div className="d-flex justify-content-between">
                                        <div className="pe-lg-3 pe-0 flex-1">
                                            <h1 className="year-title">{year.name}</h1>
                                            {year.description && <p>{year.description}</p>}
                                            <div className="subject-list">
                                                {
                                                    year.subjects.map((subject, idx) => (
                                                        <div key={idx} className="d-grid">
                                                            <Link className="btn btn-primary learn-btn" to={`/${year.slug}/${subject.slug}`} key={idx}>
                                                                <LazyLoadImage src={SubjectIcon} alt="Icon" /> <span>{subject.name}</span>
                                                            </Link>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <LazyLoadImage className="subjects-image" src={year.image} alt="subject" />
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    }
                </Container>
            </div>
        </>
    )
}

export default Subjects;