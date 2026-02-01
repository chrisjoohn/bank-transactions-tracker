import { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { Card } from 'antd';

import ChartForm from '../ChartForm';
import ChartRenderer from '../TagChartsRenderer/ChartRenderer';
import { ChartData } from '../TagChartsRenderer/ChartRenderer/ChartRenderer';
import { RootState } from '../../../integration/store';

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

const TagChartsBuilder: FC = () => {
  const [charts, setCharts] = useState<ChartShape[]>([]);
  const [forPreview, setForPreview] = useState<ChartShape | null>(null);

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

  return (
    <div>
      <Card>
        <ChartForm
          onSubmit={(data) => {
            setForPreview(data);
          }}
        />
      </Card>

      {forPreview && (
        <div>
          <h1>Sampe Chart render</h1>
          <ChartRenderer chartData={_addDummyChartData(forPreview)} />
        </div>
      )}
    </div>
  );
};

export default TagChartsBuilder;
