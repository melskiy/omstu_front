
import Chart from "chart.js";
import ChartTrasactions from "components/charts/ChartTransactions.js";
import ChartPie from "components/charts/ChartPie.js";
import ResultChart from "components/charts/ResultChart.js"; 
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import FroudTable from "./examples/FroudTable";

const Index = (props) => {
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }


  return (
    <>
      <Header />
      <Container className="mt--5" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Вакансии
                    </h6>
                  <h2 className="text-uppercase text-light ls-1 mb-1">Всего вакансий геолога</h2>
                  </div>
                </Row>
              </CardHeader>
              <div className="chart">
              <ChartTrasactions/>
              </div>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">Распределение вакансиий</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <ChartPie/>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Последние подходящие вакансии</h3>
                  </div>
                </Row>
              </CardHeader>
              <FroudTable/>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
            <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col ">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Вакансии
                    </h6>
                    <h2 className="mb-0">Распределение подходящих вакансиий</h2>
                  </div>
                </Row>
              </CardHeader>
              <br></br>
              <div className="chart">
              <ResultChart/>
                </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
