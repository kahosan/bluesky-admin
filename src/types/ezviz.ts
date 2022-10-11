export interface EzvizCameraResp {
  deviceSerial: string
  deviceName: string
  model: string
  status: number
  isEncrypt: number
  category: string
  parentCategory: string
  updateTime: number
  addTime: number | string
}

export interface EzvizCameraSearchResp {
  msg: string
  code: string
  data: EzvizCameraResp[]
  page: {
    total: number
    size: number
    page: number
  }
}

export interface EzvizDeviceListResp {
  msg: string
  code: string
  data: EzvizTableData[]
  page: {
    total: number
    size: number
    page: number
  }
}

export interface EzvizNVRCameraListResp {
  msg: string
  code: string
  data: EzvizTableData[]
}

export interface EzvizTableData {
  deviceSerial: string | JSX.Element
  deviceName: string | JSX.Element
  deviceType?: string
  status: number | JSX.Element
  addTime: number | string
  parentCategory?: string | JSX.Element
  channelName?: string | JSX.Element
  channelNo?: string
  isEncrypt?: number
  className?: string
}

export interface EzvizLiveResp {
  msg: string
  code: string
  data: {
    id: string
    url: string
    expireTime: string
  }
}

export interface DefaultResp {
  code: string
  msg: string
}
