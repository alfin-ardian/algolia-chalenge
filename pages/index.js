import React, { useState } from "react";
import algoliasearch from "algoliasearch";
import { useDebounce } from "use-debounce";
import {
  InstantSearch,
  SearchBox,
  Configure,
  connectHits,
  connectPagination,
} from "react-instantsearch-dom";
import {
  Card,
  Input,
  Pagination,
  Layout,
  Menu,
  Breadcrumb,
  Col,
  Row,
} from "antd";
const Home = () => {
  const [search, setSearch] = useState();
  const [searchDebounced] = useDebounce(search, 20);
  const searchClient = algoliasearch(
    "Q9DVHMT69L",
    "c6a617f6ab361130b780da2833c53ee5"
  );
  const [page, setPage] = useState({
    campus_current: 1,
    filter: false,
    location: "",
  });
  const { Meta } = Card;
  const { Search } = Input;
  const { Header, Content, Footer } = Layout;

  const onSearch = (value) => {
    console.log("helloworld");
  };

  // Render Arrow Pagination
  function itemRender(current, type, originalElement) {
    if (type === "prev") {
      return (
        <a>
          <i className="uil uil-angle-double-left"></i>
        </a>
      );
    }
    if (type === "next") {
      return (
        <a>
          <i className="uil uil-angle-double-right"></i>
        </a>
      );
    }
    return originalElement;
  }

  const CustomPagination = ({ nbPages, refine }) => (
    <div className="pagination-mk text-center">
      <Pagination
        defaultCurrent={page?.campus_current}
        total={nbPages * 10}
        showSizeChanger={false}
        itemRender={itemRender}
        onChange={(current) => {
          refine(current);
          setPage({ ...page, campus_current: current });
        }}
      />
    </div>
  );
  const ListCampusPagination = connectPagination(CustomPagination);

  const CustomHits = connectHits(({ hits }) => (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        {hits.map((hit) => (
          <Col span={8} key={hit.objectID}>
            <div key={hit.objectID} className="description">
              <br />
              <Card
                title={hit.name}
                bordered={false}
                style={{ width: 300 }}
                cover={<img alt={hit.event_name} src={hit.image_url} />}
              >
                <h1>{hit.speakers[0]}</h1>
                {console.log("hit", hits)}{" "}
                {hit.description.length > 20 ? (
                  <div>
                    {`${hit.description.substring(0, 60)}...`}
                    <a href="#">Read more</a>
                  </div>
                ) : (
                  <Meta title={hit.speakers[0]} description={hit.description} />
                )}
                <h4>popularity scorre : {hit.popularity_score}</h4>
                <h4>tags : {hit.tags.toString().split(",").join(", ")} </h4>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  ));

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          {new Array(1).fill(null).map((_, index) => {
            const key = index + 1;
            return <Menu.Item key={key}>{`Challenge ${key}`}</Menu.Item>;
          })}
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <div>
            <h1>Search Using Algolia</h1>
            <InstantSearch searchClient={searchClient} indexName="dev_lazycode">
              <Search
                placeholder="search here..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage({ ...page, campus_current: 1 });
                }}
                style={{ width: 1000 }}
              />
              <Configure distinct hitsPerPage={20} />

              <div hidden>
                <SearchBox defaultRefinement={searchDebounced} />
              </div>
              <CustomHits />
              <ListCampusPagination defaultRefinement={page?.campus_current} />
            </InstantSearch>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        ©2021 Created by developer.alfin@gmail.com using Ant Design
      </Footer>
    </Layout>
  );
};

export default Home;
