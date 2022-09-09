export interface EzvizCameraResp {
  msg: string
  code: string
  data: {
    deviceSerial: string
    deviceName: string
    model: string
    status: string
    isEncrypt?: string
    category?: string
  }
}
