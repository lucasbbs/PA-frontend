/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import {
  addDays,
  //  parse
} from 'date-fns';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
// import moment from 'moment';

import React, { useEffect, useState } from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// react plugin used to create charts
import { Line, Bar, Pie } from 'react-chartjs-2';

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Row,
  Col,
  Spinner,
  Input,
  Form,
  Label,
  FormGroup,
} from 'reactstrap';

// core components
import {
  // chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
  chartDefault,
} from 'variables/charts.js';
import TableTopInvestments from '../components/TableTopInvestments/TableTopInvestments';
import { fetchInvestments } from '../services/Investments';
import {
  getDataForTheFirstChart,
  getDataForTheInflationChart,
  handleSlicesOfInvestments,
} from '../helpers/functions';
import { fetchInflation } from '../services/Inflation';

Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

function Dashboard() {
  const [investments, setInvestments] = useState([]);
  const [Incomes, setIncomes] = useState([]);
  const [investmentsToBeDisplayed, setInvestmentsToBeDisplayed] = useState([]);

  const [inflations, setInflations] = useState([]);
  const [inflationsToBeDisplayed, setInflationsToBeDisplayed] = useState([]);
  const [
    dataChartInvetmentsPerBrokers,
    setDataChartInvetmentsPerartBrokers,
  ] = useState([]);

  const [bigChartData, setbigChartData] = useState('data1');

  const setBgChartData = (name) => {
    setbigChartData(name);
  };
  useEffect(() => {
    const getInvestmentDetails = async () => {
      const investment = await fetchInvestments();
      const inflation = await fetchInflation();
      setInvestments(investment);
      inflation.forEach((inf) => {
        const dataPartes = inf.data.split('/');
        inf.data = `${dataPartes[2]}-${dataPartes[1]}-${dataPartes[0]}`;
        inf.valor = Number(inf.valor) / 100 + 1;
      });
      setIncomes(getDataForTheFirstChart(investment));
      setInvestmentsToBeDisplayed(getDataForTheFirstChart(investment));

      setInflations(inflation);

      setInflationsToBeDisplayed(getDataForTheInflationChart(inflation));

      const brokers = [...new Set(investment.map((inv) => inv.broker))];
      const somas = [];
      for (let i = 0; i < brokers.length; i++) {
        let soma = 0;
        for (let j = 0; j < investment.length; j++) {
          if (investment[j].broker === brokers[i]) {
            soma += investment[j].initial_amount + investment[j].accrued_income;
          }
        }
        somas.push(soma);
      }
      setDataChartInvetmentsPerartBrokers([[...somas], [...brokers]]);
    };
    getInvestmentDetails();
  }, []);

  let chart1_2_options = {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: '#f5f5f5',
      titleFontColor: '#333',
      bodyFontColor: '#666',
      bodySpacing: 4,
      xPadding: 12,
      mode: 'nearest',
      intersect: 0,
      position: 'nearest',
      callbacks: {
        label: function (tooltipItem, data) {
          var indice = tooltipItem.index;

          return bigChartData === 'data1'
            ? `${data.labels[indice]}:  ${currencyFormat(
                data.datasets[0].data[indice]
              )}`
            : `${data.labels[indice]}:  ${(
                data.datasets[0].data[indice] / 100
              ).toLocaleString('pt-br', {
                style: 'percent',
                minimumFractionDigits: 2,
              })}
          `;
        },
      },
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            count: 0,
            callback: (label) =>
              bigChartData === 'data1'
                ? currencyFormat(Number(label))
                : (Number(label) / 100).toLocaleString('pt-br', {
                    style: 'percent',
                    minimumFractionDigits: 2,
                  }),
            suggestedMin: 60,
            padding: 20,
            fontColor: '#9a9a9a',
          },
        },
      ],
      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            padding: 20,
            fontColor: '#9a9a9a',
          },
        },
      ],
    },
  };
  if (bigChartData === 'data2') {
    chart1_2_options.scales.yAxes.ticks = {
      ...chart1_2_options.scales.yAxes.ticks,
      ...{
        suggestedMax: Math.ceil(inflationsToBeDisplayed[0].max() / 10) * 10,
      },
    };
  }

  let chartExample1 = {
    data1: (canvas) => {
      let ctx = canvas.getContext('2d');

      let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
      gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

      return {
        gradientStroke,
        labels: investmentsToBeDisplayed[1],
        datasets: [
          {
            label: 'Income',
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#1f8ef1',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#1f8ef1',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#1f8ef1',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: investmentsToBeDisplayed[0],
          },
        ],
      };
    },
    data2: (canvas) => {
      let ctx = canvas.getContext('2d');

      let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(1, 'rgba(237, 248, 29,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(237, 248, 29,0.0)');
      gradientStroke.addColorStop(0, 'rgba(237, 248, 29,0)'); //yellow colors

      return {
        gradientStroke,
        labels: inflationsToBeDisplayed[1],
        datasets: [
          {
            label: 'Inflation',
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: 'rgba(237, 248, 29)',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: 'rgba(237, 248, 29)',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: 'rgba(237, 248, 29)',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: inflationsToBeDisplayed[0], //
          },
        ],
      };
    },
    options: chart1_2_options,
  };
  // #########################################
  // // // used inside src/views/Dashboard.js
  // #########################################

  function currencyFormat(label) {
    let formatCurrency = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatCurrency.format(Number(label));
  }

  function handleFilter() {
    const initialDate = document.querySelector('#InitialDate').value;
    const finalDate = document.querySelector('#FinalDate').value;
    setInflationsToBeDisplayed(
      getDataForTheInflationChart(
        inflations,
        initialDate + '-01',
        finalDate + '-01'
      )
    );

    setInvestmentsToBeDisplayed(
      handleSlicesOfInvestments(Incomes, initialDate + '-02', finalDate + '-02')
    );
  }
  return (
    <>
      <div className='content'>
        {!dataChartInvetmentsPerBrokers.length ? (
          <>
            <h2>Carregando...</h2>

            <Spinner
              color='light'
              style={{ width: '3rem', height: '3rem' }}
              type='grow'
            />
          </>
        ) : (
          <>
            <Row>
              <Col xs='12'>
                <Card className='card-chart'>
                  <CardHeader>
                    <Row>
                      <Col md='12'>
                        <div
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <Form inline>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                              <Col sm='12'>
                                <Label for='InitialDate'>
                                  Informe uma data inicial
                                </Label>
                                <Input
                                  id='InitialDate'
                                  type='month'
                                  min={format(
                                    addDays(
                                      new Date(inflations[0]['data']),
                                      31
                                    ),
                                    'yyyy-MM',
                                    { locale: ptBR }
                                  )}
                                  max={
                                    //prettier-ignore
                                    format(addDays(new Date(inflations[inflations.length - 1]['data']),1),'yyyy-MM',{ locale: ptBR })
                                  }
                                />
                              </Col>
                            </FormGroup>
                            <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                              <Col sm='12'>
                                <Label for='FinalDate'>
                                  Informe uma data final
                                </Label>
                                <Input
                                  id='FinalDate'
                                  type='month'
                                  min={format(
                                    addDays(
                                      new Date(inflations[0]['data']),
                                      31
                                    ),
                                    'yyyy-MM',
                                    { locale: ptBR }
                                  )}
                                  max={format(
                                    addDays(
                                      new Date(
                                        inflations[inflations.length - 1][
                                          'data'
                                        ]
                                      ),
                                      1
                                    ),
                                    'yyyy-MM',
                                    { locale: ptBR }
                                  )}
                                />
                              </Col>
                            </FormGroup>

                            <Button onClick={handleFilter}>Filtrar</Button>
                          </Form>
                        </div>
                      </Col>

                      <Col className='text-left' sm='6'>
                        {/* <h5 className='card-category'>Total Shipments</h5> */}
                        <CardTitle tag='h2'>Performance</CardTitle>
                      </Col>
                      <Col sm='6'>
                        <ButtonGroup
                          className='btn-group-toggle float-right'
                          data-toggle='buttons'
                        >
                          <Button
                            tag='label'
                            className={classNames('btn-simple', {
                              active: bigChartData === 'data1',
                            })}
                            color='info'
                            id='0'
                            size='sm'
                            onClick={() => {
                              setBgChartData('data1');
                            }}
                          >
                            <span className='d-none d-sm-block d-md-block d-lg-block d-xl-block'>
                              Rendimentos
                            </span>
                            <span className='d-block d-sm-none'>
                              <i className='tim-icons icon-single-02' />
                            </span>
                          </Button>
                          <Button
                            color='info'
                            id='1'
                            size='sm'
                            tag='label'
                            className={classNames('btn-simple', {
                              active: bigChartData === 'data2',
                            })}
                            onClick={() => {
                              setBgChartData('data2');
                            }}
                          >
                            <span className='d-none d-sm-block d-md-block d-lg-block d-xl-block'>
                              Inflação
                            </span>
                            <span className='d-block d-sm-none'>
                              <i className='tim-icons icon-gift-2' />
                            </span>
                          </Button>
                          <Button
                            color='info'
                            id='2'
                            size='sm'
                            tag='label'
                            className={classNames('btn-simple', {
                              active: bigChartData === 'data3',
                            })}
                            onClick={() => setBgChartData('data3')}
                          >
                            <span className='d-none d-sm-block d-md-block d-lg-block d-xl-block'>
                              Sessions
                            </span>
                            <span className='d-block d-sm-none'>
                              <i className='tim-icons icon-tap-02' />
                            </span>
                          </Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className='chart-area'>
                      <Line
                        options={chartExample1.options}
                        data={chartExample1[bigChartData]}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg='4'>
                <Card className='card-chart'>
                  <CardHeader>
                    <h5 className='card-category'>Total Shipments</h5>
                    <CardTitle tag='h3'>
                      <i className='tim-icons icon-bell-55 text-info' /> 763,215
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className='chart-area'>
                      <Line
                        data={chartExample2.data}
                        options={chartExample2.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg='4'>
                <Card className='card-chart'>
                  <CardHeader>
                    <h5 className='card-category'>Daily Sales</h5>
                    <CardTitle tag='h3'>
                      <i className='tim-icons icon-delivery-fast text-primary' />
                      3,500€
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className='chart-area'>
                      <Bar
                        data={chartExample3.data}
                        options={chartExample3.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg='4'>
                <Card className='card-chart'>
                  <CardHeader>
                    <h5 className='card-category'>Completed Tasks</h5>
                    <CardTitle tag='h3'>
                      <i className='tim-icons icon-send text-success' /> 12,100K
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className='chart-area'>
                      <Line
                        data={chartExample4.data}
                        options={chartExample4.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg='6' md='12'>
                <Card className='card-tasks'>
                  <CardHeader>
                    <h6 className='title d-inline'>
                      Investimentos por Corretoras
                    </h6>

                    <UncontrolledDropdown>
                      <DropdownToggle
                        caret
                        className='btn-icon'
                        color='link'
                        data-toggle='dropdown'
                        type='button'
                      >
                        <i className='tim-icons icon-settings-gear-63' />
                      </DropdownToggle>
                      <DropdownMenu aria-labelledby='dropdownMenuLink' right>
                        <DropdownItem
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          Action
                        </DropdownItem>
                        <DropdownItem
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          Another action
                        </DropdownItem>
                        <DropdownItem
                          href='#pablo'
                          onClick={(e) => e.preventDefault()}
                        >
                          Something else
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </CardHeader>
                  <CardBody>
                    <Pie
                      data={chartDefault(
                        dataChartInvetmentsPerBrokers[0],
                        dataChartInvetmentsPerBrokers[1]
                      )}
                      options={chartDefault().options}
                    />
                  </CardBody>
                </Card>
              </Col>
              <TableTopInvestments investments={investments} />
            </Row>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
