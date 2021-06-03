import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Table
} from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import Spinner from "../components/Spinner/Spinner";

import { fetchInvestments } from "../services/Investments";

const InvestmentsList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [investment, setInvestment] = useState([]);
  useEffect(() => {
    const getInvestments = async () => {
      setIsLoading(true);
      let investments = await fetchInvestments();
      const filter = JSON.parse(localStorage.getItem("filter"));

      if (filter !== null) {
        investments =
          filter.trim() === ""
            ? [...investments]
            : investments.filter((invest) =>
                invest.name.toLowerCase().includes(filter)
              );
        localStorage.removeItem("filter");
        // investment.forceUpdate();
      }

      setInvestment(investments);
      if (investments.length !== 0) {
        setIsLoading(false);
      }
      return investments;
    };
    getInvestments();
    // dispatch({ type: INVESTMENT_LIST_REQUEST });
  }, []);

  return (
    <>
      {" "}
      {isLoading ? <Spinner /> : ""}
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader className="row justify-content-between ml-5 mt-1 mr-5 align-items-center">
                <CardTitle className="m-0" tag="h4">
                  Investimentos
                </CardTitle>
                <Link to="/admin/investment/:id">
                  <Button>Novo Investimento</Button>
                </Link>
              </CardHeader>
              <CardBody>
                <Table
                  className="tablesorter"
                  responsive
                  style={{ overflowX: "auto" }}
                >
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Broker</th>
                      <th>Type</th>
                      <th>Rate</th>
                      <th>Indexer</th>
                      <th>investment date</th>
                      <th>due date</th>
                      <th className="text-center">initial amount</th>
                      <th className="text-center">accrued income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investment.map((inves) => (
                      <tr key={inves._id}>
                        <td>
                          <Link to={`/admin/investment/${inves._id}`}>
                            {inves.name}
                          </Link>
                        </td>
                        <td>{inves.broker}</td>
                        <td>{inves.type}</td>
                        <td>{inves.rate}</td>
                        <td>{inves.indexer}</td>
                        <td>
                          {moment(inves.investment_date).format("DD/MM/YYYY")}
                        </td>
                        <td>{moment(inves.due_date).format("DD/MM/YYYY")}</td>
                        <td className="text-center">
                          {inves.initial_amount.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          })}
                        </td>
                        <td className="text-center">
                          {inves.accrued_income.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          })}
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
