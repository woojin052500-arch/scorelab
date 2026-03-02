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

const DEFAULT_LEVEL_COLORS = [
  "#10B981", // 안정 - green
  "#06B6D4", // 적정 - cyan
  "#F59E0B", // 경쟁/상향 - amber
  "#EF4444", // 힘듦 - red
  "#5766A8", // brand purple/blue
];

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
            backgroundColor: colors || DEFAULT_LEVEL_COLORS,
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
