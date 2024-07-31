import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card } from 'react-bootstrap'
import { Helmet } from "react-helmet";
import DataTable from '../../components/DataTable'
import Http from '../../services/Http'
import moment from 'moment'

const Invoices = () => {
  const navigate = useNavigate()
  const [isGetData, setIsGetData] = useState(false)
  const [data, setData] = useState([])
  const [sort, setSort] = useState()
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    totalCount: 0,
    pageSize: 10
  });
  const columns = [
    {
      key: '_id',
      name: 'No',
      width: 65,
      render: (rowData, idx) => idx + 1
    },
    {
      key: 'invoice_id',
      name: 'Invoice number'
    },
    {
      key: 'item_name',
      name: 'Item'
    },
    {
      key: 'amount',
      name: 'Amount'
    },
    {
      key: 'gst',
      name: 'GST'
    },
    {
      key: 'currency',
      name: 'Currency'
    },
    {
      key: 'paid_date',
      name: 'Paid date',
      render: (rowData, idx) =>
        moment(rowData.paid_date).format('DD/MM/YYYY')
    }
  ]
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
          title: "AnswerSheet - Invoices",
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
        title: "AnswerSheet - Invoices",
        viewport: "width=device-width,initial-scale=1",
      })
    });
  }, []);

  useEffect(() => {
    const getInvoices = async () => {
      let { data } = await Http.get('invoices', {
        params: {
          search: search,
          length: pagination.pageSize,
          page: pagination.page,
          sortKey: sort ? sort.key : '',
          sortDir: sort ? sort.dir : ''
        }
      })
      setData(data.data)
      setPagination({ ...pagination, totalCount: data.totalCount })
    }
    getInvoices()
  }, [isGetData])
  const onChange = ({ search, pagination, sort }) => {
    setSort(sort)
    setSearch(search)
    setPagination(pagination)
    setIsGetData(!isGetData)
  }
  const onRow = id => {
    navigate(`/invoices/${id}`)
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
      <div className='invoices-container py-4'>
        <Container>
          <Card className='create-subject-container'>
            <Card.Header bsPrefix='card-header py-3 bg-white'>
              <Card.Title bsPrefix='card-title mb-0' as='h1'>
                Invoices
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <DataTable
                columns={columns}
                data={data}
                sort={sort}
                search={search}
                pagination={pagination}
                emptyText='No invoices available'
                onRow={onRow}
                onChange={onChange}
              />
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  )
}

export default Invoices
