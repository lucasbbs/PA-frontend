import axios from 'axios';
import { addDays, format, parse } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import NotificationAlert from 'react-notification-alert';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from 'reactstrap';
import { reverseFormatNumber } from '../../helpers/functions';
import { ptBR } from 'date-fns/locale';

import Config from '../../config.json';

const Incomes = ({
  incomes,
  setNumberPerPage,
  setNewIncomes,
  incomesToBeUpdated,
  setAccruedIncome,
  id,
  setIsLoading,
}) => {
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
  const [valueIncome, setValueIncome] = useState(0);
  const [dateIncome, setDateIncome] = useState('');
  const [modal, setModal] = useState(false);
  const [modalAddIncome, setModalAddIncome] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [updatedIncome, setUpdatedIncome] = useState(incomesToBeUpdated);

  const [isAdding, setIsAdding] = useState(false);
  const [dateEl, setDateEl] = useState(format(new Date(), 'yyyy-MM'));
  const [valueEl, setValueEl] = useState('0');

  useEffect(() => {
    if (isAdding) {
      setIsAdding(false);
      let incomeObject = {};
      incomeObject[
        format(parse(dateEl, 'yyyy-MM', new Date()), 'yyyy-MM-dd')
      ] = reverseFormatNumber(valueEl);

      var index = updatedIncome
        .map((key) => Object.keys(key)[0])
        .indexOf(Object.keys(incomeObject)[0]);
      handleAddIncome({ incomes: updatedIncome }, dateEl, valueEl, index);
    }
  }, [updatedIncome]);

  const toggle = () => {
    setModal(!modal);
    setIsValid(true);
  };
  const toggleAddIncome = (e, value = undefined) => {
    setModalAddIncome(!modalAddIncome);
    if (isEdit) {
      setIsEdit(false);
      setDateIncome('');
      setValueIncome(0.0);
    }
  };
  const fun = (e, defaultValue = undefined) => {
    let inputEl = undefined;

    if (defaultValue === undefined) {
      inputEl = document.querySelector('#ModalInputId').value;
    } else {
      inputEl = defaultValue;
    }
    if (inputEl < 0 || inputEl > 15) {
      setIsValid(false);
    } else {
      setIsValid(true);
      setNumberPerPage(inputEl);
      if (defaultValue === undefined) {
        toggle();
      }
    }
  };

  const handleIncome = () => {
    setIsLoading(true);
    if (isEdit) {
      setDateEl(document.querySelector('#IncomeDate').value);
      setIsEdit(false);
      setDateIncome('');
      setValueIncome(0.0);
    }

    let incomeObject = {};
    incomeObject[
      format(parse(dateEl, 'yyyy-MM', new Date()), 'yyyy-MM-dd')
    ] = reverseFormatNumber(valueEl);

    const index = updatedIncome
      .map((key) => Object.keys(key)[0])
      .indexOf(Object.keys(incomeObject)[0]);

    if (index !== -1) {
      updatedIncome.splice(index, 1);
      setUpdatedIncome(
        [...updatedIncome, incomeObject].sort(
          (a, b) => new Date(Object.keys(a)[0]) - new Date(Object.keys(b)[0])
        )
      );
    } else {
      setUpdatedIncome(
        [...updatedIncome, incomeObject].sort(
          (a, b) => new Date(Object.keys(a)[0]) - new Date(Object.keys(b)[0])
        )
      );
    }

    toggleAddIncome(null, true);
  };
  const handleAddIncome = async (incomesObj, index) => {
    await axios
      .put(`${Config.SERVER_ADDRESS}/api/investments/${id}/incomes`, incomesObj)
      .then((response) => {
        setIsLoading(false);
        notify(
          `Voc?? cadastrou com sucesso a receita para o per??odo de ${format(
            parse(dateEl, 'yyyy-MM', new Date()),
            'MMM/yyyy',
            { locale: ptBR }
          )}`
        );
        if (index === -1) {
          incomes.push([
            format(parse(dateEl, 'yyyy-MM', new Date()), 'dd/MM/yyyy'),
            reverseFormatNumber(valueEl),
          ]);
        } else {
          incomes[index] = [
            format(parse(dateEl, 'yyyy-MM', new Date()), 'dd/MM/yyyy'),
            reverseFormatNumber(valueEl),
          ];
        }

        const dates = updatedIncome
          .filter((invest) => Object.values(invest)[0] !== null)
          .map((key) => Object.keys(key).map((date) => date))
          .flat()
          .map((data) => {
            let datePartes = data.split('-');
            return `${datePartes[2]}/${datePartes[1]}/${datePartes[0]}`;
          });

        const IncomesTemp = updatedIncome
          .filter((invest) => Object.values(invest)[0] !== null)
          .map((key) => Object.values(key)[0]);

        let temparray = [];
        for (let i = 0; i < IncomesTemp.length; i++) {
          temparray.push([dates[i], IncomesTemp[i]]);
        }

        setNewIncomes(temparray);

        setAccruedIncome(
          Number(
            updatedIncome
              .map((key) => Object.values(key)[0])
              .reduce((acc, curr) => acc + curr, 0)
              .toFixed(2)
          )
        );
      })
      .catch((err) => {
        setIsLoading(false);
        notify(err.response.data, 'danger');
      });
    if (index === -1) {
    }
  };

  const handleRemoveIncome = async (input, removido) => {
    setIsLoading(true);
    // console.log(setIsLoading(true));

    let incomesObj = { incomes: input };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .put(
        `${Config.SERVER_ADDRESS}/api/investments/${id}/incomes`,
        incomesObj,
        config
      )
      .then((response) => {
        setIsLoading(false);
        notify(
          `Voc?? removeu com sucesso a receita do per??odo de ${format(
            addDays(new Date(Object.keys(removido[0])[0]), 1),
            'MMM/yyyy',
            {
              locale: ptBR,
            }
          )}`
        );
      })
      .catch((err) => {
        setIsLoading(false);
        notify(err.response.data, 'danger');
      });
    const dates = updatedIncome
      .filter((invest) => Object.values(invest)[0] !== null)
      .map((key) => Object.keys(key).map((date) => date))
      .flat()
      .map((data) => {
        let datePartes = data.split('-');
        return `${datePartes[2]}/${datePartes[1]}/${datePartes[0]}`;
      });

    const IncomesTemp = updatedIncome
      .filter((invest) => Object.values(invest)[0] !== null)
      .map((key) => Object.values(key)[0]);

    let temparray = [];
    for (let i = 0; i < IncomesTemp.length; i++) {
      temparray.push([dates[i], IncomesTemp[i]]);
    }

    setNewIncomes(temparray);

    setAccruedIncome(
      Number(
        updatedIncome
          .map((key) => Object.values(key)[0])
          .reduce((acc, curr) => acc + curr, 0)
          .toFixed(2)
      )
    );
  };
  return (
    <div>
      <div className='react-notification-alert-container'>
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Modal
        isOpen={modalAddIncome}
        toggle={() => toggleAddIncome(null, true)}
        keyboard={true}
      >
        <ModalHeader
          toggle={() => {
            toggleAddIncome(null, true);
          }}
        >
          Adicionar Receita
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Row className='align-items-center'>
              <Col md='6'>
                <Label style={{ marginBottom: '0' }}>Data do rendimento</Label>
              </Col>
              <Col md='6'>
                <Input
                  style={{ color: 'black', background: 'transparent' }}
                  readOnly={isEdit}
                  id='IncomeDate'
                  type='month'
                  value={dateIncome}
                  onChange={(e) => {
                    setDateIncome(e.target.value);
                    setDateEl(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row className='align-items-center' style={{ marginTop: '6px' }}>
              <Col md='6'>
                <Label style={{ marginBottom: '0' }}>Valor</Label>
              </Col>
              <Col md='6'>
                <NumberFormat
                  id='IncomeValue'
                  value={valueIncome}
                  style={{ color: 'black' }}
                  type='text'
                  placeholder='R$0.00'
                  thousandSeparator={'.'}
                  decimalSeparator={','}
                  prefix={'R$'}
                  customInput={Input}
                  onChange={(e) => {
                    if (isEdit) {
                      setDateEl(document.querySelector('#IncomeDate').value);
                    }
                    setValueIncome(e.target.value);
                    setValueEl(e.target.value);
                  }}
                />
              </Col>
            </Row>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            onClick={() => {
              setIsAdding(true);
              handleIncome();
            }}
            style={{ margin: '0 20px 20px' }}
          >
            Definir
          </Button>
          <Button
            color='secondary'
            onClick={() => toggleAddIncome(null, true)}
            style={{ margin: '0 20px 20px' }}
          >
            Voltar
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Defina quantas receitas por p??gina ser??o exibidas
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            {isValid ? (
              <Input
                type='number'
                id='ModalInputId'
                style={{ color: 'black' }}
                min={0}
                max={15}
              />
            ) : (
              <>
                <Input
                  style={{ marginBottom: '20px', color: 'black' }}
                  invalid
                  type='number'
                  id='ModalInputId'
                  min={0}
                  max={15}
                />
                <FormFeedback tooltip>
                  Voc?? deve informar um n??mero emtre 0 e 15
                </FormFeedback>
              </>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            onClick={fun}
            style={{ margin: '0 20px 20px' }}
          >
            Definir
          </Button>
          <Button
            color='secondary'
            onClick={toggle}
            style={{ margin: '0 20px 20px' }}
          >
            Voltar
          </Button>
        </ModalFooter>
      </Modal>
      <Card style={{ marginTop: '25px' }}>
        <CardHeader
          stlye={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h4 className='title d-inline'>Receitas</h4>
          <Link to='#' onClick={toggle}>
            <i
              title='Defina quantas receitas de juros ser??o exibidas por p??gina'
              className='tim-icons icon-settings-gear-63'
              style={{ float: 'right', marginLeft: '20px', fontSize: '1.5em' }}
            />
          </Link>
          <Link to='#' onClick={toggleAddIncome}>
            {/* <span style={{ float: 'right', fontSize: '1.5em' }}>+</span> */}
            <i
              title='Cadastrar uma nova receita de juros'
              className='tim-icons icon-simple-add'
              style={{ float: 'right', fontSize: '1.5em' }}
            />
          </Link>
        </CardHeader>
        <CardBody>
          <Table className='tablesorter'>
            <tbody className='text-primary'>
              <tr>
                {incomes.map((data) => (
                  <td key={data[0]}>{data[0]}</td>
                ))}
              </tr>

              <tr>
                {incomes.map((key, index) => (
                  <td key={key[0]}>
                    <span
                      id={key[0]}
                      className='incomes'
                      onClick={(e) => {
                        if (e.target.offsetWidth + 6 < e.nativeEvent.offsetX) {
                          if (
                            e.pageY - 10 <
                            e.target.getBoundingClientRect().top
                          ) {
                            setIsEdit(true);
                            const date = format(
                              parse(e.target.id, 'dd/MM/yyyy', new Date()),
                              'yyyy-MM'
                            );
                            setDateIncome(date);
                            const value = reverseFormatNumber(
                              e.target.innerHTML
                            );
                            setValueIncome(value);
                            const newObj = {};
                            newObj[
                              format(
                                parse(e.target.id, 'dd/MM/yyyy', new Date()),
                                'yyyy-MM-dd'
                              )
                            ] = value;
                            const newarray = updatedIncome;
                            newarray.splice(
                              updatedIncome
                                .map((el) => Object.keys(el)[0])
                                .indexOf(
                                  format(
                                    parse(
                                      e.target.id,
                                      'dd/MM/yyyy',
                                      new Date()
                                    ),
                                    'yyyy-MM-dd'
                                  )
                                ),
                              1,
                              newObj
                            );
                            toggleAddIncome();
                          } else {
                            if (
                              window.confirm(
                                'Voc?? tem certeza de que deseja apagar essa receita?'
                              )
                            ) {
                              const index = updatedIncome
                                .map((key) => Object.keys(key)[0])
                                .indexOf(
                                  format(
                                    parse(
                                      e.target.id,
                                      'dd/MM/yyyy',
                                      new Date()
                                    ),
                                    'yyyy-MM-dd'
                                  )
                                );
                              try {
                                if (index !== -1) {
                                  const removido = updatedIncome.splice(
                                    index,
                                    1
                                  );
                                  handleRemoveIncome(updatedIncome, removido);
                                } else {
                                  throw new Error('Erro');
                                }
                              } catch (error) {
                                notify(error.message, 'danger');
                              }
                            }
                          }
                        }
                      }}
                    >
                      {key[1].toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Incomes;
