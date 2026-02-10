import { FC, useState } from 'react';
import { useSelector } from 'react-redux';

// components
import { Button, Card, Form } from 'antd';

import ChartForm from '../ChartForm';
import ChartRenderer from '../TagChartsRenderer/ChartRenderer';

// types
import type { ChartData } from '../TagChartsRenderer/TagChartsRenderer';
import type { RootState } from '../../../integration/store';
import { accountsApi, type Account } from '../../../integration/apis/accounts';

export interface TagChartsBuilderProps {
  accountId: Account['unique_code'];
}

export interface ChartShape {
  title: string;
  chartType: 'bar' | 'line';
  data: {
    tags: string[];
  };

  preFilter?: {
    mainTag?: string;
  };

  series: {
    tagId: string;
    alias?: string;
    style: { color: string };
  }[];
}

const TagChartsBuilder: FC<TagChartsBuilderProps> = (props) => {
  const { accountId } = props;
  const [forPreview, _setForPreview] = useState<ChartShape | null>(null);

  const [formInstance] = Form.useForm();

  const [createChart] = accountsApi.useCreateChartMutation();

  const reduxTags = useSelector((state: RootState) => state.tags);

  const _addDummyChartData = (shape: ChartShape): ChartData => {
    const createDataObj = (tags: string[]) => {
      return tags.reduce((acc, curr) => {
        acc[curr] = Math.floor(Math.random() * 1000);
        return acc;
      }, {} as { [key: string]: number });
    };

    const dummyData = Array.from({ length: 10 }, (_, idx) => {
      return { ...createDataObj(shape.data.tags), period: idx };
    });

    // Transform the data as needed
    const chartData: ChartData = {
      title: shape.title,
      chartType: shape.chartType,
      preFilter: { mainTag: shape.preFilter?.mainTag },
      data: dummyData,
      series: shape.series.map((key) => ({
        tagId: key.tagId,
        tagName: reduxTags.entities[key.tagId]?.name ?? '',
        alias: key.alias,
        style: { color: key.style.color },
      })),
    };

    return chartData;
  };

  const _createChart = () => {
    if (forPreview) {
      createChart?.({ id: accountId, requestBody: forPreview });
    }
  };

  return (
    <div>
      <Card>
        <ChartForm
          onSubmit={(data) => {
            _setForPreview(data);
          }}
          form={formInstance}
          actionButton={false}
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <Button onClick={formInstance.submit}>Preview</Button>
        </div>
      </Card>

      {forPreview && (
        <div>
          <h1>Sample Chart render</h1>
          <ChartRenderer chartData={_addDummyChartData(forPreview)} />
          <Button onClick={_createChart}>Add Chart</Button>
        </div>
      )}
    </div>
  );
};

export default TagChartsBuilder;
