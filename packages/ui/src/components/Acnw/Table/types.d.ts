export interface ITableSelectedRows {
  data: {
    index: number // row index in table
    dataIndex: number // index into the source data
  }[]
  lookup: { [key: number]: boolean }
}

export type IDisplayData = { data: any[]; dataIndex: number }[]
