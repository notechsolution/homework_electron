const { AzureService } = require('./services/AzureService');
const { Logger } = require('./logger');

// Run under folder: dumka\src\main
// For all repos: ..\..\node_modules\.bin\ts-node untag.ts 0.1.0
// For particular repo: ..\..\node_modules\.bin\ts-node untag.ts 0.1.0 iqgw-release/csbc_hm_evt_hub

(async function main() {
  const args = process.argv.slice(2);
  const tagName = args[0];
  if (!tagName) {
    console.error('Tag name is missing!');
    return;
  }

  const registryMetas = {
    'csbc-release/csbc_hm_biz_api': 'gsbnacr',
    'csbc-release/csbc_hm_acs_svc': 'gsbnacr',
    'csbc-release/csbc_encryptgo': 'gsbnacr',
    'csbc-release/csbc_hm_console': 'gsbnacr'
  } as any;
  let repoNames;
  if (args[1]) {
    repoNames = args[1].split(',');
  } else {
    repoNames = Object.keys(registryMetas);
  }

  try {
    const service = new AzureService(new Logger());

    for (let i = 0; i < repoNames.length; i++) {
      const repositoryName = repoNames[i];
      console.log('Untagging: ', registryMetas[repositoryName], repositoryName, tagName);
      const result = await service.deleteTag(registryMetas[repositoryName], repositoryName, tagName);
      console.log(result);
    }
  } catch (e) {
    console.error(e);
  }
})();
