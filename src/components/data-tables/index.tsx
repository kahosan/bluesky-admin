import { Table } from '@geist-ui/core';
import type { TableDataItemBase, TableRowClassNameHandler } from '@geist-ui/core/esm/table';
import type { TableColumns, TableData } from './types';

interface TableProps<T> {
  columns: TableColumns
  data: TableData<T>
  TableRowClassNameHandler?: TableRowClassNameHandler<T>
}

const DataTable = <T extends TableDataItemBase>({ data, columns, TableRowClassNameHandler }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <Table data={data} rowClassName={TableRowClassNameHandler} hover={false}>
        {columns.map(col => (
          <Table.Column
            key={col.label}
            prop={col.prop}
            label={col.label}
            width={col.width}
            className="whitespace-nowrap !text-14px"
          >
            {col.children}
          </Table.Column>
        ))}
      </Table>
    </div>
  );
};

export default DataTable;
