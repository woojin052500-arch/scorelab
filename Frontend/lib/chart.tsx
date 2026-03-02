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
            backgroundColor: colors || [
              '#10B981', // 안정
              '#06B6D4', // 적정
              '#F59E0B', // 경쟁/상향
              '#EF4444', // 힘듦
              '#5766A8', // brand
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
