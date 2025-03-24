import React from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = () => {
  const [state, setState] = useState({
    series: [
      {
        name: "Peso",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "Pulso",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
      {
        name: "Temperatura",
        data: [21, 42, 55, 42, 44, 62, 51],
      },
      {
        name: "Oxigenación",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "Frecuencia respiratoria",
        data: [21, 42, 55, 42, 44, 62, 51],
      },
      {
        name: "Nivel de glucosa",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
    options: {
      title: {
        text: "Histórico",
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "22px",
          fontWeight: "bold",
          fontFamily: undefined,
          color: "#283945",
        },
      },
      chart: {
        height: 350,
        type: "line",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2025-03-15T02:02:41.014255",
          "2025-03-16T02:02:41.014255",
          "2025-03-17T02:02:41.014255",
          "2025-03-18T02:02:41.014255",
          "2025-03-19T02:02:41.014255",
          "2025-03-20T02:02:41.014255",
          "2025-03-21T02:02:41.014255",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="line"
        height={230}
      />
    </div>
  );
};

export default LineChart;
