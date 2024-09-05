
const { ipcRenderer } = (window as any)?.electron;

async function listTags(acr: string, repository: string) {
  const repositoryNames = await ipcRenderer.invoke('service:call', 'AzureService', 'listRepository', acr, repository);
  return repositoryNames;
}

async function deleteTag(acr: string, repository: string, tagName: string) {
  const repositoryNames = await ipcRenderer.invoke('service:call', 'AzureService', 'deleteTag', acr, repository, tagName);
  return repositoryNames;
}

async function foo() {
  const result = await ipcRenderer.invoke('service:call', 'FooService', 'foo');
  return result;
}

export {
  listTags,
  deleteTag,
  foo
}
