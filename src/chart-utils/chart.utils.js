import { chartStore } from "../store/chart/chart.store";
import { sub, add, format, isFirstDayOfMonth } from "date-fns";
import * as d3 from "d3";
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
export const changeDomain = (delta = 0) => {
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
    const newMinDate = sub(minDate, OneMonth);
    newXDomain = [...[newMinDate, maxDate]];
  }
  if (delta < 0) {
    const newMinDate = add(minDate, OneMonth);

    newXDomain = [...[newMinDate, maxDate]];
  }
  chartStore.setXDomain(newXDomain);

  //   resizeDomain({
  //     axis: "Y",
  //     key: "date",
  //     min: newXDomain[0],
  //     max: newXDomain[1],
  //   });
  //xDomain = [...[xDomain[0].setMonth(xDomain[0].getMonth() - 1), xDomain[1]]];
};

export const handlePanMove = ({ detail = { dx: 0, dy: 0 } }) => {
  const { dx, dy } = detail;
  const [minDate, maxDate] = getMinAndMaxXDomainFromStore();
  const newMinDate =
    dx < 0 ? add(minDate, { days: 3 }) : sub(minDate, { days: 3 });
  const newMaxDate =
    dx < 0 ? add(maxDate, { days: 3 }) : sub(maxDate, { days: 3 });

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
