"use client";
import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(...registerables);

export type BarChartProps = {
  labels: string[];
  data: number[];
  colors?: string[];
  width?: number;
  height?: number;
};

export function BarChart({ labels, data, colors, width = 320, height = 240 }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor:
              colors || [
                "#6366f1",
                "#f59e42",
                "#10b981",
                "#f43f5e",
                "#a78bfa",
              ],
            borderRadius: 8,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [labels, data, colors]);
  return <canvas ref={canvasRef} width={width} height={height} />;
}
