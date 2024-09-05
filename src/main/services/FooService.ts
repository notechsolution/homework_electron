import { BaseService } from './BaseService'
import { Inject, Service } from './Service'
import { add } from '/@shared/sharedLib'

export class FooService extends Service {
  @Inject('BaseService')
  private baseService!: BaseService

  /**
   * Example for inject and shared lib
   */
  async foo() {
    const result = await this.baseService.getBasicInformation()
    const sum = add(1, 2)
    this.log(`Call function imported from /shared folder! 1 + 2 = ${sum}`)
    return {
      ...result,
      foo: 'bar'
    }
  }

  // async parsePdf() {
  //   const PDFParser = require('pdf2json');
  //   const pdfParser = new PDFParser();

  //   pdfParser.on('pdfParser_dataError', (errData: any) => console.error(errData.parserError));
  //   pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
  //     console.log(JSON.stringify(pdfData.Meta));
  //     pdfData.Pages.forEach((page: any, index: number) => {
  //       console.log('Page ' + (index + 1));
  //       page.Texts.forEach((text: any, tIndex: number) => {
  //         text.R.forEach((R: any) => {
  //           console.log('T' + tIndex + ' ' + decodeURIComponent(R.T));
  //         })
  //       })
  //     });
  //   });

  //   // pdfParser.loadPDF('D:/Lames/private/cook/04-春分+南方膳.pdf');
  //   pdfParser.loadPDF('D:/Lames/private/cook/04-春分+北方菜.pdf');

  //   const fs = require('fs');
  //   const pdf = require('pdf-parse');
  //   const dataBuffer = fs.readFileSync('D:/Lames/private/cook/04-春分+北方菜.pdf');

  //   pdf(dataBuffer).then(function (data: any) {
  //     // number of pages
  //     console.log('numpages:' + data.numpages);
  //     // number of rendered pages
  //     console.log('numrender: ' + data.numrender);
  //     // PDF info
  //     console.log('info:' + data.info);
  //     // PDF metadata
  //     console.log('metadata:' + data.metadata);
  //     // PDF.js version
  //     // check https://mozilla.github.io/pdf.js/getting_started/
  //     console.log(data.version);
  //     // PDF text
  //     console.log('text:' + data.text);
  //   });

  //   return 'hello'
  // }
}
