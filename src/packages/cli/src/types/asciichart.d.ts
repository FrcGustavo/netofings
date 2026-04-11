declare module 'asciichart' {
  export type PlotConfig = {
    height?: number;
    offset?: number;
    padding?: string;
  };

  export function plot(series: number[], config?: PlotConfig): string;

  const asciichart: {
    plot: typeof plot;
  };

  export default asciichart;
}
