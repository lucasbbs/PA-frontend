import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Spinner from '../components/Spinner/Spinner';
import { fetchInvestments } from '../services/Investments';
import MyPopover from '../components/Popover/MyPopover';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';
import Config from '../config.json';

const InvestmentsList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [investment, setInvestment] = useState([]);
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  useEffect(() => {
    const getInvestments = async () => {
      setIsLoading(true);
      let investments = await fetchInvestments('', login);
      const filter = JSON.parse(localStorage.getItem('filter'));

      if (filter !== null) {
        investments =
          filter.trim() === ''
            ? [...investments]
            : investments.filter((invest) =>
                invest.name.toLowerCase().includes(filter)
              );
        localStorage.removeItem('filter');
      }

      setInvestment(investments);
      if (investments.length !== 0) {
        setIsLoading(false);
      }
      return investments;
    };
    getInvestments();
  }, []);
  // const handleScrolling = (state) => {
  //   // left: 37, up: 38, right: 39, down: 40,
  //   // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  //   var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  //   function preventDefault(e) {
  //     e.preventDefault();
  //   }

  //   function preventDefaultForScrollKeys(e) {
  //     if (keys[e.keyCode]) {
  //       preventDefault(e);
  //       return false;
  //     }
  //   }

  //   // modern Chrome requires { passive: false } when adding event
  //   var supportsPassive = false;
  //   try {
  //     window.addEventListener(
  //       'test',
  //       null,
  //       Object.defineProperty({}, 'passive', {
  //         get: function () {
  //           supportsPassive = true;
  //         },
  //       })
  //     );
  //   } catch (e) {}

  //   var wheelOpt = supportsPassive ? { passive: false } : false;
  //   var wheelEvent =
  //     'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

  //   // call this to Disable
  //   function disableScroll() {
  //     window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  //     window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  //     window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  //     window.addEventListener('keydown', preventDefaultForScrollKeys, false);
  //   }

  //   // call this to Enable
  //   function enableScroll() {
  //     window.removeEventListener('DOMMouseScroll', preventDefault, false);
  //     window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  //     window.removeEventListener('touchmove', preventDefault, wheelOpt);
  //     window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
  //   }

  //   if (state) {
  //     console.log(state);
  //     disableScroll();
  //   } else {
  //     console.log(state);
  //     enableScroll();
  //   }
  // };
  const notificationAlertRef = useRef(null);
  const notify = (message, type = 'success', place = 'tc') => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{message}</div>
        </div>
      ),
      type: type,
      icon: 'tim-icons icon-bell-55',
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`${Config.SERVER_ADDRESS}/api/investments/${id}`)
      .then((response) => {
        console.log(response);
        notify(`Investimento excluído com Sucesso`);
        setInvestment(investment.filter((invest) => invest._id !== id));
      })
      .catch((err) => {
        console.log(err);
        notify(err.response.data, 'danger');
      });
  };
  return (
    <>
      {' '}
      {isLoading ? <Spinner /> : ''}
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <div className='content'>
        <Row>
          {investment.map((invest, key) => (
            <MyPopover
              key={invest._id}
              id={invest._id}
              target={'sel' + invest._id}
              handleDelete={(id) => handleDelete(id)}
            ></MyPopover>
          ))}
          <Col md='12'>
            <Card style={{ position: 'relative' }}>
              <CardHeader className='row justify-content-between ml-5 mt-1 mr-5 align-items-center'>
                <CardTitle className='m-0' tag='h4'>
                  Investimentos
                </CardTitle>

                <Link to='/app/investment/:id'>
                  <Button>Novo Investimento</Button>
                </Link>
              </CardHeader>
              <CardBody>
                <Table
                  className='tablesorter'
                  responsive
                  style={{ overflowX: 'auto', position: 'relative' }}
                >
                  <thead className='text-primary'>
                    <tr>
                      <th>Name</th>
                      <th>Broker</th>
                      <th>Type</th>
                      <th>Rate</th>
                      <th>Indexer</th>
                      <th>investment date</th>
                      <th>due date</th>
                      <th className='text-center'>initial amount</th>
                      <th className='text-center'>accrued income</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investment.map((inves) => (
                      <tr key={inves._id}>
                        <td>
                          <Link to={`/app/investment/${inves._id}`}>
                            {inves.name}
                          </Link>
                        </td>
                        <td>{inves.broker}</td>
                        <td>{inves.type}</td>
                        <td>{inves.rate}</td>
                        <td>{inves.indexer}</td>
                        <td>
                          {moment(inves.investment_date).format('DD/MM/YYYY')}
                        </td>
                        <td>{moment(inves.due_date).format('DD/MM/YYYY')}</td>
                        <td className='text-center'>
                          {inves.initial_amount.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>
                        <td className='text-center'>
                          {inves.accrued_income.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Link
                            style={{
                              backgroundColor: 'transparent',
                              outline: 'none',
                              borderColor: 'transparent',
                            }}
                            data-target='#'
                            id={'sel' + inves._id}
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                            to='#'
                          >
                            <span
                              style={{
                                width: '30px',
                                display: 'inline-block',
                                border: '1px solid #ba54f5',
                              }}
                            >
                              <i className='fas fa-ellipsis-v visible-on-sidebar-regular'></i>
                              {/* <object
                                style={{
                                  pointerEvents: 'none',
                                  marginTop: '7px',
                                  width: '3px',
                                }}
                                alt='ellipsis'
                                data={ellipsisV}
                              > */}
                              {/* ellipsis */}
                              {/* </object> */}
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default InvestmentsList;
