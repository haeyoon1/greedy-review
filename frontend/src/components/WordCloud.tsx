import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import "./WordCloud.css";

interface Word {
  text: string;
  value: number;
}

interface Props {
  words: Word[];
  onWordClick?: (text: string) => void;
}

export default function WordCloud({ words, onWordClick }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // 초록 테마 색상 팔레트
  const greenPalette = [
    "#10b981", // emerald-500 (primary)
    "#059669", // emerald-600 (primary-dark)
    "#34d399", // emerald-400 (primary-light)
    "#6ee7b7", // emerald-300
    "#047857", // emerald-700
    "#064e3b", // emerald-900
    "#a7f3d0", // emerald-200
    "#14b8a6", // teal-500
    "#0d9488", // teal-600
    "#2dd4bf", // teal-400
  ];

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.max(400, Math.min(600, width * 0.625));
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!words.length || !svgRef.current) return;

    const { width, height } = dimensions;

    const layout = cloud()
      .size([width, height])
      .words(
        words.map((d) => ({
          text: d.text,
          size: Math.max(14, Math.min(60, 16 + d.value * 2.5)),
        }))
      )
      .padding(8)
      .rotate(() => {
        const rand = Math.random();
        if (rand > 0.7) return 90;
        if (rand > 0.5) return -90;
        return 0;
      })
      .font("Pretendard, -apple-system, sans-serif")
      .fontSize((d: any) => d.size as number)
      .on("end", draw);

    layout.start();

    function draw(data: any[]) {
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("class", "word-cloud-svg");

      svg.selectAll("*").remove();

      const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const words = g
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .style("font-family", "Pretendard, -apple-system, sans-serif")
        .style("font-size", (d) => d.size + "px")
        .style("font-weight", (d) => (d.size > 30 ? "700" : "600"))
        .style("fill", (_, i) => greenPalette[i % greenPalette.length])
        .style("opacity", 0)
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text((d) => d.text)
        .style("cursor", "pointer")
        .attr("class", "word-cloud-word")
        .on("click", (_, d: any) => onWordClick?.(d.text))
        .on("mouseenter", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("font-weight", "700")
            .attr("transform", function (d: any) {
              const scale = 1.15;
              return `translate(${d.x},${d.y}) rotate(${d.rotate}) scale(${scale})`;
            });
        })
        .on("mouseleave", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0.9)
            .style("font-weight", (d: any) => (d.size > 30 ? "700" : "600"))
            .attr("transform", function (d: any) {
              return `translate(${d.x},${d.y}) rotate(${d.rotate}) scale(1)`;
            });
        });

      // 애니메이션: 페이드인 효과
      words
        .transition()
        .duration(800)
        .delay((_, i) => i * 30)
        .style("opacity", 0.9);
    }
  }, [words, dimensions, onWordClick]);

  return (
    <div ref={containerRef} className="word-cloud-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}
