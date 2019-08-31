export interface TableSelectedRows {
  data: {
    index: number // row index in table
    dataIndex: number // index into the source data
  }[]
  lookup: { [key: number]: boolean }
}

export type DisplayData = { data: any[]; dataIndex: number }[]
