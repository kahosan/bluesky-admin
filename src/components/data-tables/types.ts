export type TableColumns = Array<{
  prop: string
  label: string
  width?: number
  children?: React.ReactNode
}>;

export type TableData<T> = T[];
