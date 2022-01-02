import React, { useState, useMemo, useEffect } from 'react';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { DateHelper } from 'utils/dateHelper';
import EmptyTable from 'uiKits/emptyTable/EmptyTable';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { UtilsHelper } from 'utils/UtilsHelper';

const WeeklySailedOrders = ({ weeklySailedOrders, loading }) => {
  const { t } = useTranslation();

  const [loadChart, setLoadChart] = useState(false);
  const [orderDate, setOrderDate] = useState<any>([]);
  const [orderCountData, setOrderCountData] = useState([]);
  const [amountData, setAmountData] = useState([]);

  const getValues = () => {
    setOrderDate(
      weeklySailedOrders.map((value) => DateHelper.isoDateTopersian(value.date))
    );
    setAmountData(weeklySailedOrders.map((_item) => _item.amount));
    setOrderCountData(weeklySailedOrders.map((_item) => _item.orderCount));
    setLoadChart(true);
  };

  useEffect(() => {
    getValues();
  }, []);

  useMemo(() => {
    if (weeklySailedOrders.length > 0) {
      getValues();
    }
  }, [weeklySailedOrders]);

  const options = {
    chart: {
      type: 'column',
    },
    title: {
      text: '',
    },
    subtitle: {
      text: '',
    },
    xAxis: {
      categories: loadChart ? orderDate : [],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'تعداد',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: 'تعداد سفارش',
        data: loadChart ? orderCountData : [],
        color: '#8f255a',
      },
      {
        name: 'میزان فروش',
        data: loadChart ? amountData : [],
        color: '#25b37c',
      },
    ],
  };

  return (
    <>
      {loadChart ? (
        <HighchartsReact options={options} highcharts={Highcharts} />
      ) : (
        <p>درحال بارگذاری</p>
      )}
    </>
  );
};

export default WeeklySailedOrders;
