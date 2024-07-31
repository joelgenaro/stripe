import { useState, useEffect } from "react";
import { Row, Col, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap"
import Http from "../../../../services/Http"

const CategoryList = () => {
  const [years, setYears] = useState([]);

  useEffect(() => {
    (async () => {
      let { data } = await Http.get("years")
      setYears(data.data);
    })();
  }, []);

  return (
    <Row>
      {years.length !== 0 &&
        years.map((year, idx) => (
          <Col lg="6" key={idx}>
            <div className="category">
              <div className="category-list-content">
                <h3 className="category-title">{year.name}</h3>
                <Nav className="flex-column">
                  {year.subjects.map((subject, idx) => (
                    <Nav.Item key={idx}>
                      <LinkContainer to={`/${year.slug}/${subject.slug}`}>
                        <Nav.Link className="d-flex">
                          <i className="fa fa-circle"></i>
                          <span>{subject.name}</span>
                        </Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
              <div className="category-banner-content">
                <img
                  src={year.image}
                  className="category-banner-img"
                  alt="year-banner"
                  width={349}
                  height={300}
                />
              </div>
            </div>
          </Col>
        ))}
    </Row>
  )
}

export default CategoryList;