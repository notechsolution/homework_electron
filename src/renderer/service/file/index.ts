
const { ipcRenderer } = (window as any)?.electron;

async function saveFile(filePath: string, content: string) : Promise<{ isNew: boolean; status: string; filePath: any; }> {
  const result = await ipcRenderer.invoke('service:call', 'FileService', 'saveFile', filePath, content);
  return result;
}

async function openFile() : Promise<{filePath: string, content: string}> {
  const result = await ipcRenderer.invoke('service:call', 'FileService', 'openFile');
  return result;
}

export {
  saveFile,
	openFile
}
