import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { PpkDocument } from '@/types'

export async function exportDocumentsToExcel(documents: PpkDocument[]) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Rekap Dokumen PPK')

  worksheet.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Judul Dokumen', key: 'title', width: 40 },
    { header: 'Versi', key: 'version', width: 10 },
    { header: 'KSM', key: 'ksm', width: 25 },
    { header: 'Jenis', key: 'type', width: 20 },
    { header: 'Tgl Pengesahan', key: 'validation_date', width: 20 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Diunggah Oleh', key: 'uploader', width: 25 },
    { header: 'Link File', key: 'url', width: 50 },
  ]

  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF41A67E' }
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }

  documents.forEach((doc, index) => {
    const row = worksheet.addRow({
      no: index + 1,
      title: doc.title,
      version: doc.version || '1',
      ksm: doc.medical_staff_groups?.name || '-',
      type: doc.ppk_types?.name || '-',
      validation_date: doc.validation_date 
        ? new Date(doc.validation_date).toLocaleDateString('id-ID')
        : '-',
      status: doc.is_active ? 'Aktif' : 'Non-Aktif',
      uploader: doc.profiles?.full_name || 'System',
      url: { text: 'Buka File', hyperlink: doc.file_url }
    })

    row.getCell('url').font = {
      color: { argb: 'FF0000FF' },
      underline: true
    }
    
    row.alignment = { vertical: 'middle', wrapText: true }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const fileName = `Rekap_PPK_RSUP_${new Date().toISOString().split('T')[0]}.xlsx`
  
  saveAs(blob, fileName)
}