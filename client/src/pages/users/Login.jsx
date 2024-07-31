import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser } from "../../store/reducers/userReducer";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import * as yup from "yup";
import { Container, Form, Button } from "react-bootstrap";
import FormInput from "../../components/FormInput";
import { useGoogleLogin } from "@react-oauth/google";
import { LazyLoadImage } from "react-lazy-load-image-component";
import LoginSvg from "../../assets/images/svg/home/illustration3.svg";
import GoogleSvg from "../../assets/images/svg/google/google.svg";
import Http from "../../services/Http";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [wrongCount, setWrongCount] = useState(0);
    const [leftSeconds, setLeftSeconds] = useState(60);
    const [myInterval, setMyInterval] = useState({});
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
                    title: "AnswerSheet - Login",
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
                title: "AnswerSheet - Login",
                viewport: "width=device-width,initial-scale=1",
            })
        });
    }, []);

    useEffect(() => {
        let temp = window.localStorage.getItem('leftSeconds') ?? 60;
        if (temp < 60 && temp > 0) {
            setWrongCount(5);
            setLeftSeconds(temp);
        }
    }, []);
    let user = { email: "", password: "" };

    const validationSchema = yup.object({
        email: yup.string('Enter your email.')
            .email('Enter a valid email.')
            .required('Email is required.'),
        password: yup.string('Enter your password.')
            .required('Password is required.')
    });

    const onLogin = async (user, { resetForm }) => {
        let { data } = await Http.post("login", user);
        if (data.status) {
            resetForm();
            toast.success(data.msg);
            await dispatch(createUser({
                user: data.user,
                token: data.token
            }));
            if (data.user.role > 0) {
                navigate("/admin/users");
            } else {
                navigate("/subjects");
            }
        } else {
            if (data.wrongInfo) {
                setWrongCount(prev => prev + 1);
            }
            if (wrongCount < 5) {
                toast.error(data.msg);
            }
        }
    }

    useEffect(() => {
        if (wrongCount === 5) {
            setLeftSeconds(60);
            let myInterval = setInterval(() => setLeftSeconds(prev => prev - 1), 1000);
            setMyInterval(myInterval);
        } else {
            return;
        }
    }, [wrongCount]);

    useEffect(() => {
        if (leftSeconds < 0) {
            setMyInterval(clearInterval(myInterval));
            setWrongCount(0);
            window.localStorage.setItem('leftSeconds', 0);
        }
        window.localStorage.setItem('leftSeconds', leftSeconds);
    }, [leftSeconds]);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenRes) => {
            let { data } = await Http.post("login/google", tokenRes);
            if (data.status) {
                toast.success(data.msg);
                await dispatch(createUser({
                    user: data.user,
                    token: data.token
                }));
                if (data.user.role > 0) {
                    navigate("/admin/users");
                } else {
                    navigate("/subjects");
                }
            } else {
                toast.error(data.msg);
            }
        },
        onError: errRes => {
            toast.error(errRes.toString());
        }
    })

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
            <div className="login-container">
                <Container>
                    <div className="page-content">
                        <div className="page-left-content">
                            <LazyLoadImage src={LoginSvg} alt="Login" />
                        </div>
                        <div className="page-right-content">
                            <div className="login-form">
                                {
                                    wrongCount > 4 && leftSeconds > 0 ? <p className="text-danger">Try again after {leftSeconds} seconds.</p> : null
                                }
                                <h1 className="page-title">Welcome back</h1>
                                <Formik
                                    validationSchema={validationSchema}
                                    validateOnChange={false}
                                    validateOnBlur={false}
                                    onSubmit={onLogin}
                                    initialValues={user}
                                >
                                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                                        <Form noValidate onSubmit={handleSubmit} className="mt-4">
                                            <div className="d-grid">
                                                <Button variant="primary" className="google-signin-btn" onClick={googleLogin} disabled={leftSeconds > 0 && wrongCount > 4}>
                                                    <LazyLoadImage src={GoogleSvg} alt="google" style={{ marginRight: 15 }} />
                                                    Sign in with Google
                                                </Button>
                                            </div>
                                            <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                                                <div style={{ flex: 1 }}><hr /></div>
                                                <div className="py-2 px-3 fw-bold text-dark">OR</div>
                                                <div style={{ flex: 1 }}><hr /></div>
                                            </div>
                                            <p className="mb-4">Please enter your details.</p>
                                            <FormInput
                                                className="mb-4"
                                                required
                                                name="email"
                                                icon="fa fa-envelope"
                                                type="email"
                                                placeholder="Email"
                                                onChange={handleChange}
                                                value={values.email}
                                                touched={touched}
                                                errors={errors}
                                                disabled={leftSeconds > 0 && wrongCount > 4}
                                            />
                                            <FormInput
                                                className="mb-3"
                                                required
                                                name="password"
                                                icon="fa fa-lock"
                                                type="password"
                                                placeholder="Password"
                                                onChange={handleChange}
                                                value={values.password}
                                                touched={touched}
                                                errors={errors}
                                                disabled={leftSeconds > 0 && wrongCount > 4}
                                            />
                                            <p className="mb-1">Don't have an account? <Link className="" to="/signup">Sign up free</Link></p>
                                            <p className="mb-4"><Link className="" to="/forgot-password">Forgot password?</Link></p>
                                            <div className="d-grid">
                                                <Button variant="primary" type="submit" disabled={leftSeconds > 0 && wrongCount > 4}>Log in</Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default Login;