import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/reducers/userReducer";
import { Container, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Http from "../../services/Http";
import { createUser } from "../../store/reducers/userReducer";
import "./BillingSuccess.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SuccessRegisterSvg from "../../assets/images/success_register.svg"

const BillingSuccess = () => {
    const { gateway } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
        const setBillingTransaction = async () => {
            dispatch(setLoading(true));
            setTimeout(async () => {
                let paymentId;
                let payerId
                let historyId = searchParams.get('history_id');
                if (gateway === "paypal") {
                    paymentId = searchParams.get("paymentId");
                    payerId = searchParams.get("PayerID");
                } else if (gateway === "stripe") {
                    paymentId = searchParams.get("session_id");
                    payerId = 0;
                }

                let oldTransactionId = localStorage.getItem('membershipHistoryId');

                if (oldTransactionId === null || oldTransactionId !== historyId) {
                    localStorage.setItem("membershipHistoryId", historyId)
                    let { data } = await Http.get(`billing/${gateway}/return?paymentId=${paymentId}&payerId=${payerId}&historyId=${historyId}`);
                    if (data.success) {
                        // Do Manual Login
                        let email = data.email;
                        let user = { email: email };
                        let resp = await Http.post("login-manual", user);
                        if (resp.data.status) {
                            await dispatch(createUser({
                                user: resp.data.user,
                                token: resp.data.token
                            }));
                            window.localStorage.removeItem('membership')
                            window.localStorage.removeItem('premiumUser')
                            navigate('/current-membership');
                        } else {
                            toast.error(resp.data.msg);
                        }

                        dispatch(setLoading(false));
                    } else {
                        if (data.retry) {
                            await setBillingTransaction();
                        } else {
                            dispatch(setLoading(false));
                            toast.error(data.msg);
                        }
                    }
                } else if (oldTransactionId === historyId) {
                    dispatch(setLoading(false));
                    toast.error('You already made this purchase.');
                    navigate('/current-membership');
                }
            }, 2500);
        }
        setBillingTransaction();
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
            <div className="confirm-contact-container d-flex align-items-center justify-content-center">
                <Container className="d-flex align-items-center justify-content-center" >
                    <Card style={{ flexBasis: 550, textAlign: 'center', padding: 20, marginTop: 20 }}>
                        <Card.Body>
                            <LazyLoadImage src={SuccessRegisterSvg} alt="Successfully purchased" width={160} />
                            <h3 style={{ marginTop: 16 }}>Successfully purchased</h3>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </>
    )
}

export default BillingSuccess