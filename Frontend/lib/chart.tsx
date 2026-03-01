"use client";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(...registerables);

export type PieChartProps = {
  labels: string[];
  data: number[];
  colors?: string[];
  width?: number;
  height?: number;
};

export function PieChart({ labels, data, colors, width = 320, height = 320 }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      type: "pie",
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
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: "bottom" as const,
          },
        },
      },
    });
    return () => chart.destroy();
  }, [labels, data, colors]);
  return <canvas ref={canvasRef} width={width} height={height} />;
}
