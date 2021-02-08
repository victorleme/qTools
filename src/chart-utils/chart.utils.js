import { chartStore } from "../store/chart/chart.store";
import {
  sub,
  add,
  format,
  isFirstDayOfMonth,
  differenceInMilliseconds,
  subMilliseconds,
  addMilliseconds,
  differenceInDays,
  isValid,
} from "date-fns";
import * as d3 from "d3";
export const getDifferenceInMilliseconds = (dLater, dEarly) => {
  return differenceInMilliseconds(dLater, dEarly);
};
export const getDifferenceInDays = (dLater, dEarly) => {
  return differenceInDays(dLater, dEarly);
};
export const getDomainOfDateRange = ({ data = [], key = "" }) => {
  return d3.extent(data, function (d) {
    return d[key];
  });
};
export const willUpdateXDomainInStore = (xDomain = []) => {
  let xDomainStore = [];
  chartStore.subscribe((store) => {
    xDomainStore = [...store.xDomain];
  });

  if (!xDomain[0] || !xDomain[1]) return null;
  if (!xDomainStore[0] || !xDomainStore[1]) return null;
  const willUpdateDomain =
    xDomain[0].getTime() === xDomainStore[0].getTime() &&
    xDomain[1].getTime() === xDomainStore[1].getTime();
  return !willUpdateDomain;
};
export const resizeDomain = ({
  axis = "Y",
  key = "",
  yKey = "",
  min = 0,
  max = Infinity,
}) => {
  let data = [];
  chartStore.subscribe((store) => {
    data = [...store.data];
  });
  const _data = [...data].filter((d) => {
    return d[key] > min && d[key] < max;
  });
  if (axis === "Y" && _data.length > 0) {
    yDomain = [...[d3.min(_data, (d) => d.low), d3.max(_data, (d) => d.high)]];
  }
};
export const getMinAndMaxXDomainFromStore = () => {
  let xDomainStore = [];

  chartStore.subscribe((store) => {
    xDomainStore = [...store.xDomain];
  });
  if (xDomainStore.length !== 2) return;
  const maxDate = xDomainStore[1];
  const minDate = xDomainStore[0];
  return [minDate, maxDate];
};
export const filterDataByXDomain = ({ data = [], xDomain = [], xKey = "" }) => {
  return data.filter((d) => {
    return d[xKey] > xDomain[0] && d[xKey] < xDomain[1];
  });
};
export const changeDomain = (delta = 0, stepInMs = 0) => {
  let xDomainStore = [];
  let newXDomain = [];
  const OneMonth = { months: 1 };
  chartStore.subscribe((store) => {
    xDomainStore = [...store.xDomain];
  });
  if (xDomainStore.length !== 2) return;
  const maxDate = xDomainStore[1];
  const minDate = xDomainStore[0];

  if (delta > 0) {
    const newMinDate = subMilliseconds(minDate, stepInMs); //sub(minDate, OneMonth);

    newXDomain = [...[newMinDate, maxDate]];
    chartStore.setXDomain(newXDomain);
  }
  if (delta < 0) {
    const newMinDate = addMilliseconds(minDate, stepInMs); //add(minDate, OneMonth);

    newXDomain = [...[newMinDate, maxDate]];
    chartStore.setXDomain(newXDomain);
  }

  //   resizeDomain({
  //     axis: "Y",
  //     key: "date",
  //     min: newXDomain[0],
  //     max: newXDomain[1],
  //   });
  //xDomain = [...[xDomain[0].setMonth(xDomain[0].getMonth() - 1), xDomain[1]]];
};

export const changeDomainCTRL = ({
  delta = 0,
  stepInteger = 2,
  xCenter = 0,
}) => {
  let xDomainStore = [];
  let newXDomain = [];
  const OneMonth = { months: 1 };
  chartStore.subscribe((store) => {
    xDomainStore = [...store.xDomain];
  });
  if (xDomainStore.length !== 2) return;
  const maxDate = xDomainStore[1];
  const minDate = xDomainStore[0];

  if (delta < 0) {
    const xCenterMinusMinDate =
      getDifferenceInMilliseconds(xCenter, minDate) / stepInteger;
    const maxDateMinusXCenter =
      getDifferenceInMilliseconds(maxDate, xCenter) / stepInteger;
    const newMinDate = subMilliseconds(xCenter, xCenterMinusMinDate); //sub(minDate, OneMonth);
    const newMaxDate = addMilliseconds(xCenter, maxDateMinusXCenter);
    console.log("zoom in", xCenterMinusMinDate, newMinDate, minDate, xCenter);
    newXDomain = [...[newMinDate, newMaxDate]];
  }
  if (delta > 0) {
    const xCenterMinusMinDate =
      getDifferenceInMilliseconds(xCenter, minDate) * stepInteger;
    const maxDateMinusXCenter =
      getDifferenceInMilliseconds(maxDate, xCenter) * stepInteger;
    const newMinDate = subMilliseconds(xCenter, xCenterMinusMinDate); //sub(minDate, OneMonth);
    const newMaxDate = addMilliseconds(xCenter, maxDateMinusXCenter);

    newXDomain = [...[newMinDate, newMaxDate]];
  }
  console.log(newXDomain);
  chartStore.setXDomain(newXDomain);

  //   resizeDomain({
  //     axis: "Y",
  //     key: "date",
  //     min: newXDomain[0],
  //     max: newXDomain[1],
  //   });
  //xDomain = [...[xDomain[0].setMonth(xDomain[0].getMonth() - 1), xDomain[1]]];
};
export const handlePanMove = ({ detail = { dx: 0, dy: 0 } }, stepInMs) => {
  const { dx, dy } = detail;
  const [minDate, maxDate] = getMinAndMaxXDomainFromStore();
  const newMinDate =
    dx < 0
      ? addMilliseconds(minDate, stepInMs)
      : subMilliseconds(minDate, stepInMs);
  const newMaxDate =
    dx < 0
      ? addMilliseconds(maxDate, stepInMs)
      : subMilliseconds(maxDate, stepInMs);

  let newXDomain = [...[newMinDate, newMaxDate]];
  chartStore.setXDomain(newXDomain);
  //   resizeDomain({
  //     axis: "Y",
  //     key: "date",
  //     min: newXDomain[0],
  //     max: newXDomain[1],
  //   });
};
export const formatValueInTickY = (d) => {
  return d3.format(".2s")(d);
};
export const formatDateInTickX = (d) => {
  const isFirstDay = isFirstDayOfMonth(d);
  if (isFirstDay) return format(d, "MMM");

  return format(d, "dd/MM");
};
export const formatDateInAxisDetail = (date) => {
  if (!isValid(date)) return;
  return format(date, "dd, MMM yy");
};
