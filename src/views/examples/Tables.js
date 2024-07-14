import React, { useState, useEffect } from 'react';
import cube from '@cubejs-client/core'; 
import { QueryRenderer } from '@cubejs-client/react';
import { Table, Spin } from 'antd';
import { useDeepCompareMemo } from 'use-deep-compare';
import Header from "components/Headers/Header.js";
import { Container } from 'reactstrap';
import { Input, Row, Col, Button } from 'reactstrap';

import './Tables.css';

const formatTableData = (columns, data) => {
  function flatten(columns = []) {
    return columns.reduce((memo, column) => {
      if (column.children) {
        return [...memo, ...flatten(column.children)];
      }

      return [...memo, column];
    }, []);
  }

  const typeByIndex = flatten(columns).reduce((memo, column) => {
    return { ...memo, [column.dataIndex]: column };
  }, {});

  function formatValue(value, { type, format } = {}) {
    if (value === undefined) {
      return value;
    }

    if (type === 'boolean') {
      if (typeof value === 'boolean') {
        return value.toString();
      } else if (typeof value === 'number') {
        return Boolean(value).toString();
      }

      return value;
    }

    if (type === 'number' && format === 'percent') {
      return [parseFloat(value).toFixed(2), '%'].join('');
    }
    if(value !== null){
      return value.toString();
    }else{
      return "null";
    }
    
  }

  function format(row) {
    return Object.fromEntries(
      Object.entries(row).map(([dataIndex, value]) => {
        return [dataIndex, formatValue(value, typeByIndex[dataIndex])];
      })
    );
  }

  return data.map(format);
};

const TableRenderer = ({ resultSet, pivotConfig }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    amount: '',
    operationResult: '',
    card: '',
    client: '',
    passport: '',
    phone: '',
    operationType: '',
    terminalType: '',
    city: '',
    fraud_probability: ''
  });

  const [tableColumns, dataSource] = useDeepCompareMemo(() => {
    
    const columns = resultSet.tableColumns(pivotConfig);
    return [
      columns,
      formatTableData(columns, resultSet.tablePivot(pivotConfig)),
    ];
  }, [resultSet, pivotConfig]);
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  useEffect(() => {
    setFilteredData(dataSource);
  }, [dataSource]);

  const applyFilters = () => {
    const newFilteredData = dataSource.filter((record) => {
      return (
        (filters.amount === '' || record['table_view.amount'] >= parseFloat(filters.amount)) &&
        (filters.operationResult === '' || record['table_view.operation_result'] === filters.operationResult) &&
        (filters.card === '' || record['table_view.card'] === filters.card) &&
        (filters.client === '' || record['table_view.client'] === filters.client) &&
        (filters.passport === '' || record['table_view.passport'] === filters.passport) &&
        (filters.phone === '' || record['table_view.phone'] === filters.phone) &&
        (filters.operationType === '' || record['table_view.operation_type'] === filters.operationType) &&
        (filters.terminalType === '' || record['table_view.terminal_type'] === filters.terminalType) &&
        (filters.city === '' || record['table_view.city'] === filters.city) &&
        (filters.fraud_probability === '' || record['table_view.fraud_probability'] >= parseFloat(filters.fraud_probability))
      );
    });
    setFilteredData(newFilteredData);
  };

  const rowClassName = (record, index) => {
    if (record['table_view.fraud_probability'] >= 0.8 ){
      return 'red-row';
    }else if (record['table_view.fraud_probability'] >= 0.7 && record['table_view.fraud_probability'] < 0.8){
      return 'orange-row';
    }else if(record['table_view.fraud_probability'] > 0.5 && record['table_view.fraud_probability'] < 0.7){
      return 'yellow-row';
    }else{
      return '';
    }
    
  };

  return (
    <>
      <Row>
        <Col md="6">
          <Input
            type="number"
            placeholder="Filter by amount"
            onChange={(e) => handleFilterChange('amount', e.target.value)}
          />
        </Col>

        <Col md="6">
          <Input
            type="text"
            placeholder="Filter by operation result"
            onChange={(e) => handleFilterChange('operationResult', e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <Input
            type="text"
            placeholder="Filter by card"
            onChange={(e) => handleFilterChange('card', e.target.value)}
          />
        </Col>
        <Col md="6">
          <Input
            type="text"
            placeholder="Filter by client"
            onChange={(e) => handleFilterChange('client', e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <Input
            type="text"
            placeholder="Filter by passport"
            onChange={(e) => handleFilterChange('passport', e.target.value)}
          />
        </Col>
        <Col md="6">
          <Input
            type="text"
            placeholder="Filter by phone"
            onChange={(e) => handleFilterChange('phone', e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <Input
            type="text"
            placeholder="Filter by operation type"
            onChange={(e) => handleFilterChange('operationType', e.target.value)}
          />
        </Col>
        <Col md="6">
          <Input
            type="text"
            placeholder="Filter by terminal type"
            onChange={(e) => handleFilterChange('terminalType', e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <Input
            type="text"
            placeholder="Filter by city"
            onChange={(e) => handleFilterChange('city', e.target.value)}
          />
        </Col>

        <Col md="6">
          <Input
            type="number"
            placeholder="Filter by fraud_probability"
            onChange={(e) => handleFilterChange('fraud_probability', e.target.value)}
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col md="6">
          <Button outline color="primary" onClick={applyFilters}>Применить фильтры</Button>
        </Col>
      </Row>
      <br />
      <Table
        pagination={true}
        columns={tableColumns}
        dataSource={filteredData}
        scroll={{ x: 1500 }}
        rowClassName={rowClassName}
      />
    </>
  );
};

const cubejsApi = cube(
  'eyJhbciOiJIUzI1NiR5cCI6IkpXVCJ9.eyJleHAiOjE3MjI0NzAzOTksImlzcyI6ImN1YmVjbG91ZCJ9.btLWvzpZIOSCOoZLMzhPAhA5Ubi6NOvhwmiITdSXdfk',
  { apiUrl: 'https://gold-sawfish.aws-us-east-1.cubecloudapp.dev/cubejs-api/v1' }
);
const renderChart = ({ resultSet, error, pivotConfig, onDrilldownRequested }) => {
  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return <Spin />;
  }

  return <TableRenderer resultSet={resultSet} pivotConfig={pivotConfig} />;
};

const Tables = () => {
  return (
    <>
      <Header />
      <Container className="mt-1" fluid>
      <QueryRenderer
        query={{
          "dimensions": [
            "table_view.amount",
            "table_view.operation_result",
            "table_view.card",
            "table_view.client",
            "table_view.passport",
            "table_view.phone",
            "table_view.operation_type",
            "table_view.terminal_type",
            "table_view.city",
            "table_view.terminal",
            "table_view.passport_valid_to",
            "table_view.date_of_birth",
            "table_view.date",
            "table_view.fraud_probability"
          ],
          "order": {
            "table_view.amount": "asc"
          }
        }}
        cubejsApi={cubejsApi}
        resetResultSetOnChange={false}
        render={(props) => renderChart({
          ...props,
          chartType: 'table',
          pivotConfig: {
            "x": [
              "amount",
              "operation_result",
              "card",
              "client",
              "passport",
              "phone",
              "operation_type",
              "terminal_type",
              "city",
              "terminal",
              "passport_valid_to",
              "date_of_birth",
              "date",
              "fraud_probability"
            ],
            "y": [],
            "fillMissingDates": false,
            "joinDateRange": false,
          }
        })}
      />
      </Container>
    </>
  );
};

export default Tables;
