import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/reducers/userReducer";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Http from "../../services/Http";

const VerifyChangedEmail = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        const abortController = new AbortController();
        setVerifyChangedEmail(abortController.signal);
        return () => abortController.abort();
    }, []);

    const setVerifyChangedEmail = async (signal) => {
        let { data } = await Http.get(`verify-changed-email/${token}`, { signal });
        if (data.status) {
            toast.success(data.msg);
            await dispatch(updateUser({
                user: data.user,
                token: data.token
            }));
            navigate("/subjects");
        } else {
            toast.error(data.msg);
            navigate("/login")
        }
    }
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
            <div className="page-container d-flex align-items-center justify-content-center">
                <Container className="text-center">
                    <span className="alert alert-success">Please wait while verifing your new email...</span>
                </Container>
            </div>
        </>
    )
}

export default VerifyChangedEmail;