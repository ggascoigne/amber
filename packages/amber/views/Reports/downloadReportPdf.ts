import type { ReportPdfData } from '@amber/server/src/api/contracts/reports'

const base64ToBytes = (base64: string): ArrayBuffer => {
  const binary = window.atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

export const downloadReportPdf = ({ filename, pdfData }: { filename: string; pdfData: ReportPdfData }) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const blob = new Blob([base64ToBytes(pdfData.base64)], { type: pdfData.contentType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
