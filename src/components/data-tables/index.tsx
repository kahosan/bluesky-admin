import { Table } from '@geist-ui/core';
import type { TableDataItemBase } from '@geist-ui/core/esm/table';
import type { TableColumns, TableData } from './types';

interface tableProps<T> {
  columns: TableColumns
  data: TableData<T> | undefined
}

const DataTable = <T extends TableDataItemBase>({ data, columns }: tableProps<T>) => {
  return (
    <div className="overflow-x-auto ">
      <Table data={data}>
        {columns.map(col => (
          <Table.Column
            key={col.label}
            prop={col.prop}
            label={col.label}
            width={col.width}
            className="whitespace-nowrap"
          >
            {col.children}
          </Table.Column>
        ))}
      </Table>
    </div>
  );
};

export default DataTable;
