import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DatePicker, Select, Row, Col } from 'antd';
import dayjs from 'dayjs';

import type { DatePickerProps } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

import './dateFilter.styles.scss';

type FilterType = 'month' | 'quarter' | 'year' | 'custom';

export type DateFilterProps = {
  onChange: ({
    startDate,
    endDate,
    filterType,
  }: {
    startDate: string;
    endDate: string;
    filterType: string;
  }) => void;
};

const DateFilter: FC<DateFilterProps> = (props) => {
  const { onChange } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const [filterType, setFilterType] = useState<FilterType>('month');
  const [datePickerVal, setDatePickerVal] = useState<dayjs.Dayjs>(dayjs());

  const defaultStartDate = searchParams.get('startDate');
  const defaultFilterType = searchParams.get('filterType');

  useEffect(() => {
    if (!defaultStartDate || !defaultFilterType) {
      return;
    }

    _dateChangeHandler(dayjs(defaultStartDate), defaultFilterType as FilterType);
  }, []);

  const _dateChangeHandler = (date: dayjs.Dayjs, filterType: FilterType) => {
    setFilterType(filterType);
    setDatePickerVal(date);

    let startDate = '',
      endDate = '';

    switch (filterType) {
      case 'month':
        startDate = date.startOf('month').format('YYYY-MM-DD');
        endDate = date.endOf('month').format('YYYY-MM-DD');
        break;
      case 'quarter':
        // Manually calculate quarter
        const month = date.month(); // 0-based index (0 = January, 11 = December)
        const quarter = Math.floor(month / 3) + 1; // Calculate the quarter (1 to 4)

        const startMonth = (quarter - 1) * 3 + 1;

        startDate = date
          .set('month', startMonth - 1)
          .startOf('month')
          .format('YYYY-MM-DD');
        endDate = date
          .set('month', startMonth + 1)
          .endOf('month')
          .format('YYYY-MM-DD');
        break;

      case 'year':
        startDate = date.startOf('year').format('YYYY-MM-DD');
        endDate = date.endOf('year').format('YYYY-MM-DD');
        break;
    }

    setSearchParams({
      startDate,
      filterType,
    });

    onChange({
      startDate,
      endDate,
      filterType,
    });
  };

  const dateChangeHandler: DatePickerProps['onChange'] = (date) => {
    if (!date) {
      return;
    }

    _dateChangeHandler(date, filterType);
  };

  const _filterTypeChangeHandler = (filterType: FilterType) => {
    _dateChangeHandler(dayjs(), filterType);
  };

  const customDateChangeHandler: RangePickerProps['onChange'] = (_, dateStrings) => {
    onChange({
      startDate: dateStrings[0],
      endDate: dateStrings[1],
      filterType,
    });
  };

  return (
    <Row gutter={8} className="btt-account-details-date-filter">
      <Col span={2}>
        <Select value={filterType} onChange={_filterTypeChangeHandler} className="filter-type">
          <Select.Option value="month">Month</Select.Option>
          <Select.Option value="quarter">Quarter</Select.Option>
          <Select.Option value="year">Year</Select.Option>
          <Select.Option value="custom">Custom</Select.Option>
        </Select>
      </Col>
      <Col span={6}>
        {filterType === 'month' && (
          <DatePicker.MonthPicker
            onChange={dateChangeHandler}
            className="date-picker"
            format={'MMM YYYY'}
            allowClear={false}
            value={datePickerVal}
          />
        )}
        {filterType === 'quarter' && (
          <DatePicker
            picker="quarter"
            onChange={dateChangeHandler}
            className="date-picker"
            allowClear={false}
            value={datePickerVal}
          />
        )}
        {filterType === 'year' && (
          <DatePicker.YearPicker
            onChange={dateChangeHandler}
            className="date-picker"
            allowClear={false}
            value={datePickerVal}
          />
        )}
        {filterType === 'custom' && (
          <DatePicker.RangePicker
            onChange={customDateChangeHandler}
            className="date-picker"
            allowClear={false}
          />
        )}
      </Col>
    </Row>
  );
};

export default DateFilter;
