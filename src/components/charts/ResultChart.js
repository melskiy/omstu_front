import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { Spin } from 'antd';
import React from 'react';
import { Bar} from 'react-chartjs-2';
import { useDeepCompareMemo } from 'use-deep-compare';


const COLORS_SERIES = [
  '#5b8ff9',
  '#5ad8a6',
  '#5e7092',
  '#f6bd18',
  '#6f5efa',
  '#6ec8ec',
  '#945fb9',
  '#ff9845',
  '#299796',
  '#fe99c3',
];

const commonOptions = {
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxRotation: 0,
        padding: 12,
        minRotation: 0,
      },
    },
  },
};

const useDrilldownCallback = ({
  labels,
  onDrilldownRequested,
}) => {
  return React.useCallback(
    (elements) => {
      if (elements.length <= 0) return;
      const {index } = elements[0];
      const xValues = [labels[index]];

      if (typeof onDrilldownRequested === 'function') {
        onDrilldownRequested(
          {
            xValues
          },
        );
      }
    },
    [ labels, onDrilldownRequested]
  );
};

const BarChartRenderer = ({ resultSet, pivotConfig, onDrilldownRequested }) => {
  const datasets = useDeepCompareMemo(
    () =>
      resultSet.series(pivotConfig).map((s, index) => ({
        label: s.title,
        data: s.series.map((r) => r.value),
        backgroundColor: COLORS_SERIES[index],
        fill: false,
      })),
    [resultSet, pivotConfig]
  );
  const data = {
    labels: resultSet.categories(pivotConfig).map((c) => c.x),
    datasets,
  };
  const stacked = !(pivotConfig.x || []).includes('measures');
  const options = {
    ...commonOptions,
    scales: {
      x: { ...commonOptions.scales.x, stacked },
      y: { ...commonOptions.scales.y, stacked },
    },
  };
  const getElementAtEvent = useDrilldownCallback({
    datasets: data.datasets,
    labels: data.labels,
    onDrilldownRequested,
    pivotConfig,
  });
  return (
    <Bar
      type="bar"
      data={data}
      options={options}
      getElementAtEvent={getElementAtEvent}
    />
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

  return (
  <BarChartRenderer
    resultSet={resultSet}
    pivotConfig={pivotConfig}
    onDrilldownRequested={onDrilldownRequested}
  />
);

};

const ResultChart = () => {
    return (
        <QueryRenderer
          query={{
      "dimensions": [
        "table_view.operation_result"
      ],
      "order": {
        "table_view.passport_valid_to": "asc"
      },
      "measures": [
        "table_view.count"
      ]
    }}
          cubejsApi={cubejsApi}
          resetResultSetOnChange={false}
          render={(props) => renderChart({
            ...props,
            chartType: 'bar',
            pivotConfig: {
      "x": [
        "table_view.operation_result"
      ],
      "y": [
        "measures"
      ],
      "fillMissingDates": true,
      "joinDateRange": false
    }
          })}
        />
      );
};

export default ResultChart;
      