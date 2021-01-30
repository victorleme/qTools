import * as d3 from "d3";
import moment from "moment";
export const parseDate = d3.utcParse("%m-%d-%Y");
export const textToCSV = async (text) => {
  return d3
    .csvParse(text, (d) => {
      const date = new Date(
        moment(d["Date"], "MMM DD, YYYY").format("YYYY-MM-DD")
      );

      return {
        date,
        high: +d["High"],
        low: +d["Low"],
        open: +d["Open"],
        change: d["Change %"],
        close: (1 + (1 * d["Change %"].replace("%", "")) / 100) * +d["Open"],
      };
    })
    .slice(-120);
};
