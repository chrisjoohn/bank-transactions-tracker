import { FC, useState } from 'react';

import { DatePicker, Select, Row, Col } from 'antd';
import dayjs from 'dayjs';

import type { DatePickerProps } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

import './dateFilter.styles.scss';

export type DateFilterProps = {
  onChange: ({ startDate, endDate }: { startDate: string; endDate: string }) => void;
};

const DateFilter: FC<DateFilterProps> = (props) => {
  const { onChange } = props;

  const [filterType, setFilterType] = useState<'month' | 'quarter' | 'year' | 'custom'>('month');

  const dateChangeHandler: DatePickerProps['onChange'] = (date) => {
    if (!date) {
      return;
    }

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

    onChange({
      startDate,
      endDate,
    });
  };

  const customDateChangeHandler: RangePickerProps['onChange'] = (_, dateStrings) => {
    onChange({
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
  };

  return (
    <Row gutter={8} className="btt-account-details-date-filter">
      <Col span={2}>
        <Select
          value={filterType}
          onChange={(value) => setFilterType(value)}
          className="filter-type"
        >
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
            defaultValue={dayjs()}
            allowClear={false}
          />
        )}
        {filterType === 'quarter' && (
          <DatePicker
            picker="quarter"
            onChange={dateChangeHandler}
            className="date-picker"
            allowClear={false}
          />
        )}
        {filterType === 'year' && (
          <DatePicker.YearPicker
            onChange={dateChangeHandler}
            className="date-picker"
            allowClear={false}
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
