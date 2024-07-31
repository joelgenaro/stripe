import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Http from "../../services/Http";
import "./Membership.css";

const Membership = () => {
    const navigate = useNavigate()
    const [price, setPrice] = useState(0);
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
                    title: "AnswerSheet - Get Access to our HSC resources",
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
                title: "AnswerSheet - Get Access to our HSC resources",
                viewport: "width=device-width,initial-scale=1",
            })
        });
    }, []);

    useEffect(() => {
        const get3Month1SubjectPricing = async () => {
            let { data } = await Http.get('memberships/get-membership-price', {
                params: {
                    period: 3,
                    subject_nums: 1
                }
            });
            setPrice(data.price)
        }
        get3Month1SubjectPricing()
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
            <div className="membership-container py-4">
                <Container>
                    <h1 className="page-title text-center">Membership</h1>
                    <div className="membership-items">
                        <Card className="membership-item">
                            <Card.Body>
                                <div className="membership-header">
                                    <p>Free</p>
                                    <p>Membership</p>
                                </div>
                                <div className="membership-content py-3 px-1">
                                    <ul style={{ listStyle: 'none' }}>
                                        <li><i className="fa fa-check"></i> High quality syllabus summaries.</li>
                                        <li><i className="fa fa-check"></i> HSC exam-style practice questions.</li>
                                    </ul>
                                    <div className="d-grid mx-3 mt-auto">
                                        <Button variant="primary" onClick={() => navigate("/signup")}>Sign Up For Free</Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="membership-item">
                            <Card.Body>
                                <div className="membership-header premium-membership-header">
                                    <p>AnswerSheet</p>
                                    <p>Premium</p>
                                    <h1 className="text-light mt-2">${price}</h1>
                                </div>
                                <div className="membership-content py-3 px-1">
                                    <ul style={{ listStyle: 'none' }}>
                                        <li><i className="fa fa-check"></i> High quality syllabus summaries - All topics.</li>
                                        <li><i className="fa fa-check"></i> 100’s of HSC exam-style practice questions - ALL topics.</li>
                                        <li><i className="fa fa-check"></i> Practice exams - HSC, trials, yearlies, by topic etc.</li>
                                        <li><i className="fa fa-check"></i> Homework help.</li>
                                    </ul>
                                    <div className="d-grid mx-3">
                                        <Button variant="primary" onClick={() => navigate("/premium-membership")}>View pricing</Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default Membership;