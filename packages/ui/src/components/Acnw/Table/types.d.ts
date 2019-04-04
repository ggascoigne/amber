export interface ITableSelectedRows {
  data: {
    index: number // row index in table
    dataIndex: number // index into the source data
  }[]
  lookup: { [key: number]: boolean }
}
