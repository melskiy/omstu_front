import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { Spin } from 'antd';
import React from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import {Table } from 'antd';

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

    return value.toString();
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
  const [tableColumns, dataSource] = useDeepCompareMemo(() => {
    const columns = resultSet.tableColumns(pivotConfig);
    return [
      columns,
      formatTableData(columns, resultSet.tablePivot(pivotConfig)),
    ];
  }, [resultSet, pivotConfig]);
  return (
    <Table pagination={true} columns={tableColumns} dataSource={dataSource} />
  );
};


const cubejsApi = cubejs(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjA1Mjg4MzcsImV4cCI6MTcyMDYxNTIzN30.R57wAhAbaeVq8sqEL_P-yRcplGbBy2k2TVAJCwtpEec',
  { apiUrl: 'http://localhost:4000/cubejs-api/v1' }
);

const renderChart = ({ resultSet, error, pivotConfig, onDrilldownRequested }) => {
  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return <Spin />;
  }

  return <TableRenderer resultSet={resultSet} pivotConfig={pivotConfig}  />;

};

const FroudTable = () => {
  return (
    <QueryRenderer
      query={{
  "dimensions": [
    "table_view.amount",
    "table_view.operation_result",
    "table_view.fraud_probability"
  ],
  "order": {
    "table_view.date": "desc"
  },
  "timeDimensions": [
    {
      "dimension": "table_view.date",
      "granularity": "second"
    }
  ],
  "filters": [
    {
      "member": "table_view.fraud_probability",
      "operator": "gt",
      "values": [
        "0.5"
      ]
    }
  ]
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
    "fraud_probability",
    "date.day"
  ],
  "y": [],
  "fillMissingDates": true,
  "joinDateRange": false
}
      })}
    />
  );
};

export default FroudTable;