import { PDFDocument } from 'pdf-lib';
import { type WorkEntry, type FormData } from '@/types/types';
import * as Helper from '@/utils/helpers';

const generatePdf = async (formData: FormData, periodData: WorkEntry[]) => {
  const existingPdfBytes = await fetch('/tunnit.pdf').then((res) =>
    res.arrayBuffer()
  );
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont('Helvetica');

  const period = formData.period.split('-').reverse().join('/');

  page.drawText(formData.workerName, { x: 90, y: 726, size: 12, font });
  page.drawText(period, { x: 134, y: 742, size: 12, font });
  page.drawText(formData.location, { x: 110, y: 710, size: 12, font });

  const startY = 622;
  const rowStep = 20;
  const maxWidth = 174;
  const lineHeight = 8;

  periodData.forEach((log: WorkEntry, index: number) => {
    const y: number = startY - index * rowStep;
    const week = Helper.getWeekNumber(log.date).toString();
    const date = Helper.getDay(log.date);
    const time = log.start + ' - ' + log.end;
    const hours: string = (log.minutes / 60).toFixed(2);
    page.drawText(week, { x: 60, y, size: 12, font });
    page.drawText(date, { x: 118, y, size: 12, font });
    page.drawText(time, { x: 188, y, size: 12, font });
    page.drawText(`${hours} h`, { x: 302, y, size: 12, font });

    const text = log.overtime || '';
    const textWidth = font.widthOfTextAtSize(text, 12);

    if (textWidth > maxWidth) {
      const words = text.split(' ');
      let firstLine = '';
      let secondLine = '';
      let firstLineFull = false;

      words.forEach((word: String) => {
        if (
          !firstLineFull &&
          font.widthOfTextAtSize(firstLine + word, lineHeight) < maxWidth
        ) {
          firstLine += word + ' ';
        } else {
          firstLineFull = true;
          secondLine += word + ' ';
        }
      });

      console.log(secondLine);
      if (secondLine == '') {
        page.drawText(firstLine.trim(), { x: 364, y, size: 8, font });
      } else {
        page.drawText(firstLine.trim(), { x: 364, y: y + 6, size: 8, font });
        page.drawText(secondLine.trim(), { x: 364, y: y - 3, size: 8, font });
      }
    } else {
      page.drawText(text, { x: 364, y, size: 12, font });
    }
  });

  const pdfData = await pdfDoc.save();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(
    new Blob([new Uint8Array(pdfData)], { type: 'application/pdf' })
  );
  // link.download = `Tunnit_${month}_${year}.pdf`;
  link.target = '_blank';
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(link.href);
  }, 5000);
};

export default generatePdf;
