import { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

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

  useEffect(() => {
    if (!words.length) return;

    const layout = cloud()
      .size([600, 400])
      .words(words.map((d) => ({ text: d.text, size: 12 + d.value * 3 })))
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90))
      .font("sans-serif")
      .fontSize((d: any) => d.size as number)
      .on("end", draw);

    layout.start();

    function draw(data: any[]) {
      const svg = d3
        .select(svgRef.current)
        .attr("width", 600)
        .attr("height", 400);

      svg.selectAll("*").remove();

      const g = svg
        .append("g")
        .attr("transform", "translate(300,200)");

      g.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .style("font-family", "sans-serif")
        .style("font-size", (d) => d.size + "px")
        .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text((d) => d.text)
        .style("cursor", "pointer")
        .on("click", (_, d: any) => onWordClick?.(d.text));
    }
  }, [words]);

  return <svg ref={svgRef}></svg>;
}
