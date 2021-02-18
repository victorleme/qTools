import * as d3 from "d3";
import moment from "moment";
import { getDomainOfDateRange } from "../chart-utils/chart.utils.js";
export const parseDate = d3.timeParse("%b %d, %Y");
export const formatEntry = (d) => {
  const date = d3.timeParse("%d/%m/%Y")(d["Date"]);

  return {
    date,
    high: +d["High"],
    low: +d["Low"],
    open: +d["Open"],
    volume: d["Volume"],
    close: +d["Close"],
  };
};
export const textToCSV = async (text) => {
  return d3
    .csvParse(text, (d) => {
      const date = parseDate(d["Date"]);
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
export const getFormattedDataAndXDomain = async ({
  data = [],
  sinceDate = "",
  untilDate = "",
}) => {
  const dateObjectSince = new Date(sinceDate);
  const dateObjectUntil = new Date(untilDate);

  const formattedData = data
    .map((d) => {
      const newEntry = formatEntry(d);

      return newEntry;
    })
    .filter((d) => {
      const isEqualDates =
        d.date.valueOf() === dateObjectUntil.valueOf() ||
        d.date.valueOf() === dateObjectSince.valueOf();
      const isBetweenDates =
        d.date > dateObjectSince && d.date < dateObjectUntil;
      return isEqualDates || isBetweenDates;
    });
  const xDomain = getDomainOfDateRange({ data: formattedData, key: "date" });

  return { data: formattedData, xDomain: xDomain };
};
export const getXDomainFromData = (data, xKey = "date") => {
  return getDomainOfDateRange({ data, key: xKey });
};
