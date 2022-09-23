import { useTheme } from '@geist-ui/core';

import { Search } from '@geist-ui/icons';
import { useState } from 'react';
import { Breadcrumbs } from '@/components/bread-crumbs';
import { Layout } from '@/components/layout';
import DataTable from '@/components/ezviz-table';
import type { TableColumns, TableData } from '@/components/ezviz-table/types';

const baseData: TableData<{ name: string; online: string; d1: string; d2: string; d3: string; d4: string }> = [
  {
    name: '1',
    online: 'yes',
    d1: 'sasdddddddddasd',
    d2: '2asdasdasd',
    d3: '4asdasdasd',
    d4: '2sadasdas'
  }
];

const columns: TableColumns = [
  {
    prop: 'name',
    label: 'name',
    width: 150
  },
  {
    prop: 'online',
    label: 'online',
    width: 150
  },
  {
    prop: 'd1',
    label: 'd1',
    width: 150
  },
  {
    prop: 'd2',
    label: 'd2',
    width: 150
  },
  {
    prop: 'd3',
    label: 'd3'
  },
  {
    prop: 'd4',
    label: 'd4'
  }
];

export const EzvizPage = () => {
  const theme = useTheme();
  const [data, setData] = useState<TableData<{ name: string; online: string }>>(baseData);

  return (
    <Layout name="co">
      <div className="header">
        <Breadcrumbs items={[
          { text: 'Home', id: 'home', href: '/' },
          { text: 'Ezviz', id: 'ezviz' }
        ]} />
        <h3 className="mt-5">设备列表</h3>
      </div>
      <div style={{
        padding: theme.layout.gap,
        background: theme.palette.accents_1,
        borderRadius: '5px',
        minHeight: '20rem'
      }}>
        <DataTable data={data} columns={columns} />
      </div>
    </Layout>
  );
};
