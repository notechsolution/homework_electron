import moment from 'moment'
const { ipcRenderer } = (window as any)?.electron;

async function queryApplicationInsight(keyword: string) {
  const to = moment().endOf('day').toISOString();
  const from = moment().subtract(7, 'days').startOf('day').toISOString();
  const query = `union isfuzzy=true
    availabilityResults,
    requests,
    exceptions,
    pageViews,
    traces,
    customEvents,
    dependencies
| where timestamp > datetime("${from}") and timestamp < datetime("${to}")
| where * has "${keyword}"
| order by timestamp desc
| take 100`;
  const repositoryNames = await ipcRenderer.invoke('service:call', 'AzureService', 'queryApplicationInsight', query);
  return repositoryNames;
}

export {
  queryApplicationInsight
}
