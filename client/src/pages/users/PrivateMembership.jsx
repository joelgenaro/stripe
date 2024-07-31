import { useState, useEffect } from 'react'
import {
  Container,
  Button,
  Modal,
  Table,
  Form,
  Card,
  Accordion
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../store/reducers/userReducer'
import Http from '../../services/Http'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { Helmet } from "react-helmet";
import './PrivateMembership.css'
import moment from 'moment'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import WalletSvg from '../../assets/images/Wallet.svg'
import PerfectAccessSvg from '../../assets/images/Perfect_Access.svg'
import SummarySvg from '../../assets/images/Summary.svg'
import RealAccessSvg from '../../assets/images/Real_Access.svg'
import OnlineAccessSvg from '../../assets/images/Online_Access.svg'
import VisaSvg from "../../assets/images/visa.svg"
import MasterCardSvg from "../../assets/images/mastercard.svg"
import AmexSvg from "../../assets/images/amex.svg"
import PaypalSvg from "../../assets/images/paypal.svg"
import AmountSvg from "../../assets/images/svg/invoices/amount.svg"

const PrivateMembership = () => {
  const dispatch = useDispatch()
  const user = useSelector(store => store.user.user)
  const [isOpen, setIsOpen] = useState(false)
  const [years, setYears] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [memberships, setMemberships] = useState([])
  const [membership, setMembership] = useState({ name: '' })
  const [purchasedMemberships, setPurchasedMemberships] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [step, setStep] = useState(1)
  const [paymentType, setPaymentType] = useState('stripe')
  const [currentMembership, setCurrentMembership] = useState('')
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [nextScore, setNextScore] = useState(-1);
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
          title: "AnswerSheet - AnswerSheet Premium",
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
        title: "AnswerSheet - AnswerSheet Premium",
        viewport: "width=device-width,initial-scale=1",
      })
    });
  }, []);
  useEffect(() => {
    const getMemberships = async () => {
      let { data } = await Http.get('memberships')
      setMemberships(data.memberships)
    }
    getMemberships()
  }, [])
  useEffect(() => {
    const getPurchasedMemberships = async () => {
      let { data } = await Http.get('my-memberships');
      setPurchasedMemberships(data);
    }
    getPurchasedMemberships()
  }, [])
  useEffect(() => {
    const getInvoices = async () => {
      let { data } = await Http.get('my-invoices');
      setInvoices(data);
    }
    getInvoices();
  }, []);

  useEffect(() => {
    const getYears = async () => {
      let { data } = await Http.get('years')
      if (data.success) {
        setYears(data.data)
      } else {
        toast.error(data.msg)
      }
    }
    getYears()
  }, [])

  const chooseMembershipType = membership => {
    setMembership(membership)
    setIsOpen(true)
  }

  const selectSubject = (subject, year) => {
    let subjects = [...selectedSubjects]
    let find = subjects.indexOf(subject)
    if (find > -1) {
      subjects.splice(find, 1)
    } else {
      subject.year_name = year.name;
      subjects.push(subject)
    }
    let cnt = subjects.length;
    let nextPrice = 0;

    if (cnt !== 0) {
      console.log(membership.items);
      console.log(cnt);
      nextPrice = cnt >= 3 ? membership.items[3].price : membership.items[cnt].price - membership.items[cnt - 1].price;
    }
    setNextScore(nextPrice);
    setSelectedSubjects(subjects)
  }

  const isSelectedSubject = _subject => {
    if (selectedSubjects.findIndex(subject => subject === _subject) === -1) {
      return false
    } else {
      return true
    }
  }
  const getTotalPrice = () => {
    if (selectedSubjects.length === 1) {
      let item = membership.items.find(item => Number(item.subject_nums) === 1)
      return Number(item.price)
    } else if (selectedSubjects.length === 2) {
      let item = membership.items.find(item => Number(item.subject_nums) === 2)
      return Number(item.price)
    } else if (selectedSubjects.length === 3) {
      let item = membership.items.find(item => Number(item.subject_nums) === 3)
      return Number(item.price)
    } else if (selectedSubjects.length > 3) {
      let item = membership.items.find(item => Number(item.subject_nums) === 4)
      return Number(item.price) * (selectedSubjects.length - 3) + Number(membership.items[2].price)
    } else {
      return 0
    }
  }

  const upgradeMembership = async () => {
    resetPremiumMembershipModal()
    dispatch(setLoading(true))
    let description = `${membership.name} - ${selectedSubjects.length} ${selectedSubjects.length > 1 ? 'subjects' : 'subject'} - `;
    selectedSubjects.forEach((subject, idx) => {
      if (idx === 0) description += `${subject.year_name} - ${subject.name}`;
      else description += `, ${subject.year_name} - ${subject.name}`;
    });
    let membershipToPurchase = {
      membership_id: membership._id,
      name: membership.name,
      description: description,
      period: Number(membership.items[0].period),
      subjects: selectedSubjects,
      price: getTotalPrice()
    }

    let { data } = await Http.post(`private-billing/${paymentType}`, {
      membership: membershipToPurchase
    })
    if (data.success) {
      window.location.href = data.redirect_url
    } else {
      toast.error(data.msg)
    }
    dispatch(setLoading(false))
  }

  const emailMe = async (membership, idx) => {

    let { data } = await Http.post(`private-billing`, {
      membership
    });
    if (data.success) {
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
    }
  }

  const viewEmail = async (membership, idx) => {
    setCurrentMembership(membership)
    setInvoiceModalOpen(true)
  }

  const resetPremiumMembershipModal = () => {
    setIsOpen(false);
    setSelectedSubjects([]);
    setStep(1)
  }

  var taxInvIdx = 0;

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
      <div className='private-membership-container'>
        <Container>
          <div className='page-content d-flex flex-column'>
            <h1 className='page-title mb-3 mb-md-4 text-center'>AnswerSheet Premium</h1>
            <div className='membership-items'>
              {memberships.map((membership, idx) => (
                <div className='membership-item' key={idx}>
                  <div
                    className={
                      'membership-item-header ' +
                      (membership.slug === 'unlimited-membership'
                        ? 'membership-item-unlimited-header'
                        : '')
                    }
                  >
                    <h2 className='mb-0 text-light'>{membership.label}</h2>
                    {membership.slug === 'unlimited-membership' && (
                      <p className='mb-0'>(opening special)</p>
                    )}
                  </div>
                  <div className='membership-item-content'>
                    <ul>
                      {membership.items.map((item, idx) => (
                        Number(item.subject_nums) !== 4 && (
                          <li key={idx}>
                            <i className='fa fa-circle'></i>
                            <span>
                              ${item.price} for{' '}
                              {Number(item.subject_nums) === 1
                                ? 'one subject'
                                : Number(item.subject_nums) === 2
                                  ? 'two subjects' : 'three subjects'
                              }
                            </span>
                          </li>
                        )
                      ))}
                    </ul>
                    <div className='d-grid mt-3'>
                      <Button
                        variant='primary'
                        onClick={() => chooseMembershipType(membership)}
                      >
                        Buy now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="memberships-table">
              {purchasedMemberships.length ? (
                <Card className='mt-3 mb-4'>
                  <Card.Header style={{ background: '#005492' }}>
                    <Card.Title className='mb-0 text-light'>
                      Current memberships
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Table
                      className='my-membership-tbl'
                      bsPrefix='table table-bordered text-center'
                    >
                      <thead
                        style={{ backgroundColor: '#005492', color: '#fafafa' }}
                      >
                        <tr>
                          <th>Subjects</th>
                          <th>Invoice</th>
                          <th>Current until</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className='text-center'>
                        {purchasedMemberships.map((membership, idx) => (
                          <tr key={idx}>
                            <td>
                              {
                                membership.subject ? `${membership.subject.year.name} - ${membership.subject.name}` : 'Deleted subject'
                              }
                            </td>
                            <td>
                              {membership.invoice ? "INV-" + membership.invoice.invoice_id : ''}
                            </td>
                            <td style={{ verticalAlign: 'middle' }}>
                              {Number(membership.period) === -1
                                ? 'Unlimited*'
                                : moment(membership.expiredDate).format(
                                  'DD/MM/YYYY'
                                )}
                            </td>
                            <td>
                              <Button variant='outline-success' size='sm' onClick={() => viewEmail(membership, idx)}><i className="fa fa-eye"></i></Button>
                              <Button variant='outline-danger' className="action-button-response" size='sm' onClick={() => emailMe(membership, idx)}> <i className='fa fa-envelope'></i></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              ) : null}
            </div>
          </div>
          {purchasedMemberships.length === 0 &&
            <>
              <h1 className='page-title mt-4 mb-4 text-center'>Why AnswerSheet?</h1>
              <ul className='why-answersheet-nav mb-4 mb-md-5'>
                <li>
                  <LazyLoadImage src={WalletSvg} alt='wallet' />
                  <p>One payment - no subscription - no lock in</p>
                </li>
                <li>
                  <LazyLoadImage src={PerfectAccessSvg} alt='perfect_access' />
                  <p>Access 100's of exam - style questions sorted by topic</p>
                </li>
                <li>
                  <LazyLoadImage src={SummarySvg} alt='summaries' />
                  <p>
                    Full course summaries - everything you need for a band 6 and
                    nothing extra
                  </p>
                </li>
                <li>
                  <LazyLoadImage src={RealAccessSvg} alt='real_access' />
                  <p>
                    Access our practice exams to get you ready for the real thing
                  </p>
                </li>
                <li>
                  <LazyLoadImage src={OnlineAccessSvg} alt='online_access' />
                  <p>Access online support from our team of tutors</p>
                </li>
              </ul>
            </>
          }

          <Modal
            show={isOpen}
            onHide={() => resetPremiumMembershipModal()}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size='lg'
            className='private-membership-modal'
          >
            <Modal.Body className='p-4'>
              <Modal.Title as='h3' className='mb-2'>
                {membership.label} AnswerSheet premium
              </Modal.Title>
              {step === 1 ? (
                <div className='step-1'>
                  <div>
                    <p className='fs-5 fw-400 mb-1'>Choose your subject(s)</p>
                    <Accordion defaultActiveKey={-1}>
                      {years.map((year, idx) => (
                        <Accordion.Item key={idx} eventKey={idx}>
                          <Accordion.Header>{year.name}</Accordion.Header>
                          <Accordion.Body>
                            <ul className='mb-0 nav flex-column'>
                              {year.subjects.map((subject, idx) => {
                                return (
                                  <li
                                    key={idx}
                                    className='py-2'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => selectSubject(subject, year)}
                                  >
                                    <span
                                      style={{
                                        color: '#005492'
                                      }}
                                    >
                                      {subject.name}
                                    </span>
                                    <Form.Check
                                      inline
                                      checked={
                                        isSelectedSubject(subject)
                                          ? true
                                          : false
                                      }
                                      name='subjects'
                                      className='float-end'
                                      value={subject}
                                      onChange={ev => { }}
                                    />
                                  </li>
                                )
                              })}
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                  <div className='d-flex justify-content-between align-items-center pt-2'>
                    <div>
                      <h5 className='mb-1 ps-1'>
                        Total: ${getTotalPrice()}{' '}
                        {selectedSubjects.length
                          ? `for ${selectedSubjects.length} ${selectedSubjects.length === 1 ? 'subject' : 'subjects'}`
                          : ''}
                      </h5>
                      {selectedSubjects.length && nextScore !== -2 ? <h6 className='mb-0'>Only ${nextScore} for one more subject.</h6> : ''}

                    </div>
                    <Button
                      variant='primary'
                      className='float-end'
                      disabled={getTotalPrice() === 0}
                      onClick={() => setStep(2)}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='step-2'>
                  <Table bsPrefix='bg-white table table-bordered'>
                    <thead
                      style={{ backgroundColor: '#005492', color: '#fafafa' }}
                    >
                      <tr>
                        <th>Membership</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div>{membership.name} - {selectedSubjects.length} {selectedSubjects.length > 1 ? "subjects" : "subject"}</div>
                          <ul className="mb-0">
                            {
                              selectedSubjects.map((subject, idx) => <li key={idx}>{subject.year_name} - {subject.name}</li>)
                            }
                          </ul>
                        </td>
                        <td>${getTotalPrice()}</td>
                      </tr>
                      <tr>
                        <td className='fw-bolder'>Total payment</td>
                        <td>${getTotalPrice()}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Form.Group className='mb-3'>
                    <Form.Check
                      inline
                      id='stripe'
                      type='radio'
                      name='paymentType'
                      value='stripe'
                      className='mr-3 mb-3'
                      label={
                        <>
                          <LazyLoadImage
                            src={VisaSvg}
                            alt='visa'
                            height='36'
                            className='mx-2'
                          />
                          <LazyLoadImage
                            src={MasterCardSvg}
                            alt='mastercard'
                            height='33'
                            className='mx-2'
                          />
                          <LazyLoadImage
                            src={AmexSvg}
                            alt='amex'
                            height='27'
                            className='mx-2'
                          />
                        </>
                      }
                      checked={paymentType === 'stripe'}
                      onChange={() => setPaymentType('stripe')}
                    />
                    <Form.Check
                      inline
                      id='paypal'
                      type='radio'
                      name='paymentType'
                      value='paypal'
                      label={
                        <LazyLoadImage
                          src={PaypalSvg}
                          height='45'
                          alt='paypal'
                        />
                      }
                      checked={paymentType === 'paypal'}
                      onChange={() => setPaymentType('paypal')}
                    />
                  </Form.Group>
                  <hr />
                  <div className='form-actions'>
                    <Button variant='danger' onClick={() => setStep(1)}>
                      <i className='fa fa-undo'></i> Previous
                    </Button>
                    <Button
                      variant='primary'
                      onClick={upgradeMembership}
                      className='float-end'
                    >
                      <i className='fa fa-shopping-cart'></i> Purchase
                    </Button>
                  </div>
                </div>
              )}
              <button
                className='btn-close'
                onClick={() => {
                  resetPremiumMembershipModal()
                }}
              ></button>
            </Modal.Body>
          </Modal>
          {currentMembership &&
            <Modal show={invoiceModalOpen} className="invoice-view-modal" size="xl" onHide={() => setInvoiceModalOpen(false)}>
              <Modal.Body>
                <Modal.Title>
                  <h1>Tax Invoice</h1>
                </Modal.Title>
                <Accordion defaultActiveKey="0">
                  <div style={{ display: 'none' }}>
                    {
                      taxInvIdx = 0
                    }
                  </div>
                  {
                    invoices.map((invoice, idx) => (
                      invoice.subject_id === currentMembership.subject._id &&
                      <div key={idx}>
                        {
                          <Card style={{ marginBottom: 20 }} key={idx}>
                            <Accordion.Item eventKey={`${taxInvIdx++}`} >
                              <Accordion.Header >
                                {"INV-" + invoice.invoice_id}
                              </Accordion.Header>
                              <Accordion.Body>
                                <Card className="mb-3">
                                  <Card.Body>
                                    <div className="row invoice-content">
                                      <div className='col-6'>
                                        <div className="invoice-to mb-2">
                                          <p>
                                            <span className='invoice-item-label'>To: </span>
                                            <span className='invoice-item-content'>
                                              {user.firstName} {user.lastName}
                                            </span>
                                          </p>
                                          <p>
                                            <span className='invoice-item-label'>Invoice number: </span>
                                            <span className='invoice-item-content'>
                                              {"INV-" + invoice.invoice_id}
                                            </span>
                                          </p>
                                          <p>
                                            <span className='invoice-item-label'>Issued: </span>
                                            <span className='invoice-item-content'>
                                              {moment(invoice.paid_date).format("DD/MM/YYYY")}
                                            </span>
                                          </p>
                                          <p>
                                            <span className='invoice-item-label'>Status: </span>
                                            <span className='invoice-item-content'>
                                              {invoice.isPaid ? 'PAID' : 'NOT PAID'}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                      <div className='col-6'>
                                        <div className="invoice-from mb-2">
                                          <p>
                                            <span className='invoice-item-label'>From: </span>
                                            <span className='invoice-item-content'>
                                              {invoice.company}
                                            </span>
                                          </p>
                                          <p>
                                            <span className='invoice-item-label'>ACN: </span>
                                            <span className='invoice-item-content'>
                                              {invoice.phone}
                                            </span>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Card>
                                <Card>
                                  <Card.Body className="p-4 item-description-container">
                                    <div className='row'>
                                      <div className='col-md-9'>
                                        <div className="item-description-title">Description</div>
                                        <p>{invoice.item_description}</p>
                                      </div>
                                      <div className='col-md-3 item-description-title-container'>
                                        <div className="item-description-title">
                                          <LazyLoadImage src={AmountSvg} alt="Amount" className="me-2" height={18} />
                                          Amount
                                        </div>
                                        <div><i className='fa fa-dollar'></i><span style={{ fontWeight: '600' }}>{Number(invoice.amount - invoice.gst).toFixed(2)}</span></div>
                                      </div>
                                    </div>
                                    <div className="invoice-billing-info">
                                      <div className="invoice-billing-left-info">
                                        <div>
                                          <div>Subtotal</div>
                                          <div><i className='fa fa-dollar'></i>{Number(invoice.amount - invoice.gst).toFixed(2)}</div>
                                        </div>
                                        <div>
                                          <div>GST 10%</div>
                                          <div><i className='fa fa-dollar'></i>{Number(invoice.gst).toFixed(2)}</div>
                                        </div>
                                      </div>
                                      <div className="invoice-billing-right-info">
                                        <div>Total inc. GST</div>
                                        <div><i className='fa fa-dollar'></i>{Number(invoice.amount).toFixed(2)}</div>
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Card>
                        }
                      </div>
                    ))
                  }
                </Accordion>
                <button
                  className='btn-close'
                  onClick={() => setInvoiceModalOpen(false)}
                ></button>
              </Modal.Body>
            </Modal>
          }
        </Container>
      </div>
    </>
  )
}

export default PrivateMembership