import React, { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = ({ patientChartData }) => {
  const [state, setState] = useState({
    series: [],
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
      colors: [
        "#7E57C2", 
        "#E53935", 
        "#FFB300",
        "#26C6DA", 
        "#66BB6A", 
        "#8D6E63"  
      ]
      ,
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
        categories: [],
      },
      yaxis: {
        min: undefined, // Se calculará dinámicamente
        max: undefined, // Se calculará dinámicamente
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });

  useEffect(() => {
    if (patientChartData.seriesData && patientChartData.seriesData.length > 0) {
      // Calcula el rango dinámico del eje Y
      const allValues = patientChartData.seriesData.flatMap(
        (series) => series.data
      );
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);

      // Ajusta un pequeño margen para evitar que los puntos estén en los bordes
      const margin = (maxValue - minValue) * 0.1;

      console.log("Min value:", minValue);

      setState((prevState) => ({
        ...prevState,
        series: patientChartData.seriesData,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: patientChartData.categories,
          },
          yaxis: {
            ...prevState.options.yaxis,
            min: minValue - margin,
            max: maxValue + margin,
          },
        },
      }));
    }
  }, [patientChartData]);

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
