import { useState, useEffect } from "react"
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet";
import Http from '../../services/Http'

import './AboutUs.css'

const AboutUs = () => {
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
          title: "AnswerSheet - HSC tutoring alternative",
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
        title: "AnswerSheet - HSC tutoring alternative",
        viewport: "width=device-width,initial-scale=1",
      })
    });
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

      <div className='about-us-container'>
        <Container>
          <h1 className='page-title text-center'>About us</h1>
          <p className='text-center page-description'>We make the HSC Easy.</p>
          <p className='text-center fw-bold'>
            Our learning materials cover the entire syllabus and includes:
          </p>
          <Row className="about-items my-5">
            <Col md={6}>
              <Card className="mt-2 mb-3 shadow">
                <Card.Body className="p-4">
                  <Card.Title as='h4' className='about-item-title'>
                    Exam-relevant summary of
                    <br /> each dot-point
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mt-2 mb-3 shadow">
                <Card.Body className="p-4">
                  <Card.Title as='h4' className='about-item-title'>
                    Questionnaire bank in HSC<br /> exam style, separated by topic
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mt-2 mb-3 shadow">
                <Card.Body className="p-4">
                  <Card.Title as='h4' className='about-item-title'>
                    Practice exams by modules<br /> and topics
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mt-2 mb-3 shadow">
                <Card.Body className="p-4">
                  <Card.Title as='h4' className='about-item-title'>
                    Exam-relevant summary of<br /> of each dot-point
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <p className='text-center'>
            Our learning materials are written by an inhouse team of academics and
            HSC markers.
          </p>
          <h6 className='text-center'>
            <Link className='to-signup fw-bold' to='/signup'>
              Sign up form a free account to view our learning materials
            </Link>
          </h6>
        </Container>
      </div>
    </>
  )
}

export default AboutUs
