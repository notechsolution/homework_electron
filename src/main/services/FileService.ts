import { BrowserWindow, dialog, ipcMain, Menu } from 'electron'
import fs from 'fs'
import _ from 'lodash';
import { Service } from './Service'

export class FileService extends Service {
 /**
 * @description 保存文件
 */
async saveFile (existingFilePath:string, content: string) : Promise<{ isNew: boolean; status: string; filePath: any; }> {
  if (existingFilePath) {
        fs.writeFileSync(existingFilePath, content)
        return { isNew: false, status: 'success', filePath: existingFilePath };
  } else {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: '',
      filters: [
        { name: 'File Type', extensions: ['md'] }
      ]
    })
    if (filePath) {
      fs.writeFileSync(filePath, content);
      return { isNew: true, status: 'success', filePath };
    }
    return { isNew: true, status: 'cancel', filePath };
  }
}

/**
 * @description 打开文件
 * @param status -2 -1 读取文件失败; -3 取消读取; 1 读取成功
 */
async openFile(): Promise<{filePath: string, content: string}> {
  const result = await dialog.showOpenDialog({
    title: '打开*.md文件',
    filters: [
      { name: 'File Type', extensions: ['md'] }
    ]
  })
  const filePath = _.get(result, 'filePaths[0]');
  if (_.isEmpty(filePath)) {
    return { filePath, content: '' };
  }
  const content = fs.readFileSync(filePath);
  return { filePath, content: content.toString() }
}
}
