import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Container, Card } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Helmet } from "react-helmet";
import { MathJax } from 'better-react-mathjax';
import Http from '../../services/Http'
import { toast } from 'react-toastify'
import QuestionList from "../../components/users/QuestionList";
import './Lecture.css'
import { MathJaxContext } from 'better-react-mathjax';

const config = {
  options: {
    enableMenu: false
  }
};

const Lecture = () => {
  const mathRef = useRef(1)
  const navigate = useNavigate()
  const [subTopic, setSubTopic] = useState({ name: '', content: '' })
  const [tempArr, setTempArr] = useState([]);
  const user = useSelector(store => store.user.user)
  const params = useParams()
  const [superRole, setSuperRole] = useState(0)
  const [questions, setQuestions] = useState([])
  const [prevName, setPrevName] = useState("")
  const [nextName, setNextName] = useState("")
  const [prevUrl, setPrevUrl] = useState("")
  const [nextUrl, setNextUrl] = useState("")
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

  // const pagination = {
  //   page: 1,
  //   totalCount: 2,
  //   pageSize: 1
  // };

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

  const getLecture = async () => {
    let { year, subject, module, topic, subtopic } = params;

    let { data } = await Http.get("sub-topics/get-subtopic-by-slug", {
      params: {
        year_slug: year,
        subject_slug: subject,
        module_slug: module,
        topic_slug: topic,
        subtopic_slug: subtopic
      }
    });

    let subjectId = data.subject;

    if (data.success) {
      let { permission } = data.data
      if (Number(permission) === 0) {
        setSubTopic(data.data);
      } else if (Number(permission) === 1) {
        if (user._id) {
          setSubTopic(data.data)
        } else {
          toast.info("Sign up or login to view.", {
            onClose: () => {
              navigate(`/login`)
            }
          });
        }
      } else if (Number(permission) === 2) {
        if (user._id) {
          if (user.role === 1 || user.role === 2) {
            setSubTopic(data.data)
          } else {
            let access = await Http.get('check-membership', {
              params: {
                user: user._id,
                subject: subjectId
              }
            })
            if (access.data.result === true) {
              setSubTopic(data.data)
            } else {
              toast.info('Buy AnswerSheet Premium to access.', {
                onClose: () => {
                  navigate(`/current-membership`)
                }
              });
            }
          }
        } else {
          toast.info("Sign up or login to view.", {
            onClose: () => {
              navigate(`/login`)
            }
          });
        }
      }
      setQuestions(data.questions);
      setTempArr(["AFAF"]);
      setPrevName(data.prevSubtopic.name)
      setNextName(data.nextSubtopic.name)
      setPrevUrl(data.prevSubtopic.slug);
      setNextUrl(data.nextSubtopic.slug);
    } else {
      toast.error(data.msg)
      navigate(`/subjects`)
    }
  }

  useEffect(() => {
    const handleContextMenu = (ev) => {
      ev.preventDefault();
    }
    const handleCopy = (ev) => {
      ev.preventDefault();
    }
    const handleCut = (ev) => {
      ev.preventDefault();
    }
    const handlePaste = (ev) => {
      ev.preventDefault();
    }
    const handlePrint = (ev) => {
      if ((ev.ctrlKey || ev.metaKey) && (ev.key === "p" || ev.charCode === 16 || ev.charCode === 112 || ev.keyCode === 80)) {
        ev.cancelBubble = true;
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }
    }
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCut);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('keydown', handlePrint);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("cut", handleCut);
      window.removeEventListener("paste", handlePaste);
      window.removeEventListener("keydown", handlePrint);
    }
  }, [])


  useEffect(() => {
    getLecture()
  }, [params.subtopic])

  return (
    <>
      <MathJaxContext config={config}>
        <Helmet>
          <title>{metadata.title}</title>
          <meta name="author" content={metadata.author} />
          <meta name="description" content={metadata.description} />
          <meta name="keywords" content={metadata.keywords} />
          <meta name="viewport" content={metadata.viewport} />
          <meta name={metadata.othername} content={metadata.othercontent} />
        </Helmet>
        <div className='lecture-container'>
          <Container>
            <Card className='mb-4' style={{ overflowX: 'auto' }}>
              <Card.Body className='pt-5 px-5 pb-4' id="content">
                <h1 className='lecture-title'>{subTopic.name}</h1>
                {
                  tempArr.map((temp, idx) => (
                    <div key={idx}>
                      {
                        <>
                          <MathJax>
                            <div
                              ref={mathRef}
                              className='mt-3 lecture-content'
                              dangerouslySetInnerHTML={{ __html: subTopic.content }}
                            ></div>
                          </MathJax>
                        </>
                      }
                    </div>
                  ))
                }
                <div className="pull-right" style={{ marginTop: '20px', display: 'flex' }}>
                  <a className="btn btn-primary arrow-btn" href={`/${params.year}/${params.subject}/${params.module}/${params.topic}/${prevUrl}`}>
                    <i className='fa fa-arrow-left'></i> <span className="responseTitle">{prevName}</span>
                  </a>
                  <a className="btn btn-primary arrow-btn" style={{ marginLeft: 8 }} href={`/${params.year}/${params.subject}/${params.module}/${params.topic}/${nextUrl}`}>
                    <span className="responseTitle">{nextName} &nbsp;</span><i className='fa fa-arrow-right'></i>
                  </a>
                </div>
              </Card.Body>
            </Card>
            <QuestionList questions={questions} superRole={superRole} />
          </Container>
        </div>
      </MathJaxContext>
    </>
  )
}

export default Lecture
