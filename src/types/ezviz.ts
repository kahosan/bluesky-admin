export interface EzvizCameraResp {
  deviceSerial: string
  deviceName: string
  model: string
  status: string
  isEncrypt: number
  category: string
  parentCategory: string
  updateTime: string
  addTime: string
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
  status: string | JSX.Element
  addTime: string
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
