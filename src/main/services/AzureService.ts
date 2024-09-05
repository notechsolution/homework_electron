import { Service } from './Service'
import { ContainerRegistryClient, KnownContainerRegistryAudience } from '@azure/container-registry';
import { ClientSecretCredential } from '@azure/identity'
import { ApiKeyCredentials } from '@azure/ms-rest-js'
import { ApplicationInsightsDataClient, ApplicationInsightsDataModels } from '@azure/applicationinsights-query';
import _ from 'lodash';

export class AzureService extends Service {
  private registryMetas = {
    gsbnacr: {
      endpoint: 'https://gsbnacr.azurecr.io',
      name: 'gsbnacr',
      tenantId: 'ca034fb1-2f77-4675-95b6-dd545267cef7',
      repositories: [
        'csbc-release/csbc_hm_biz_api',
        'csbc-release/csbc_hm_acs_svc',
        'csbc-release/csbc_encryptgo',
        'csbc-release/csbc_hm_console'
      ]
    },
    iqaxacr: {
      endpoint: 'https://iqaxacr.azurecr.io',
      name: 'iqaxacr',
      tenantId: 'ca034fb1-2f77-4675-95b6-dd545267cef7',
      repositories: [
        'iqgw-release/csbc_hm_evt_hub',
        'iqgw-release/iqgw_admin_console',
        'iqgw-release/iqgw_gw_core'
      ]
    }
  } as any;

  async listRepository(acr: string, resigtryName: string) {
    const registryMeta = this.registryMetas[acr];
    const clientId = 'cb7ec5ca-4b42-4c5c-b19f-a8768a97870a'; // process.env.AZURE_CLIENT_ID || '';
    const clientSecret = 'FxoyY1mKLzpj9KMvZzlJ2dsz6e-gr8pBXE'; // process.env.AZURE_CLIENT_SECRET || '';
    const azureCredential = new ClientSecretCredential(registryMeta.tenantId, clientId, clientSecret);
    const client = new ContainerRegistryClient(registryMeta.endpoint, azureCredential, {
      audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud
    });
    let registryNames;
    if (!_.isEmpty(resigtryName)) {
      registryNames = [resigtryName];
    } else {
      registryNames = registryMeta.repositories;
    }
    const repositories = [];
    for (const repositoryName of registryNames) {
      const repository = await client.getRepository(repositoryName);
      const properties = await repository.getProperties();
      const result = {
        name: repository.name,
        endpoint: properties.registryLoginServer,
        lastUpdatedOn: properties.lastUpdatedOn.toISOString(),
        tagCount: properties.tagCount,
        manifestCount: properties.manifestCount,
        latestTag: '',
        dockerUrl: '',
        manifests: [] as any
      }
      const manifestProperties = await repository.listManifestProperties();
      const manifests = [];
      for await (const manifest of manifestProperties) {
        manifests.push({
          repository: repository.name,
          digest: manifest.digest,
          tags: manifest.tags,
          lastUpdatedOn: manifest.lastUpdatedOn.toISOString()
        })
      }
      result.manifests = _.orderBy(manifests, ['lastUpdatedOn'], 'desc');
      const sortedManifests = _.orderBy(_.filter(result.manifests, manifest => !_.isEmpty(manifest.tags)), ['lastUpdatedOn'], 'desc');
      result.latestTag = sortedManifests[0].tags;
      result.dockerUrl = `${result.endpoint}/${result.name}:${result.latestTag[0]}`
      this.log(`  repository: ${JSON.stringify(result)}`);
      repositories.push(result);
    }
    return repositories
  }

  async queryApplicationInsight(query: string) {
    const creds = new ApiKeyCredentials({ inHeader: { 'x-api-key': '5smiaco7tzv5ff0qfj813w6i0c6clh6vugdaajjd' } })
    const appId = '142a2b86-039f-4b61-8fa0-0d4170ece914';
    const baseUri = 'https://api.applicationinsights.io';
    const client = new ApplicationInsightsDataClient(creds, { baseUri });
    const queryBody = {
      query,
      timespan: ''
    } as ApplicationInsightsDataModels.QueryBody;
    const response = await client.query.execute(appId, queryBody);
    return response.tables;
  }

  async deleteTag(acr: string, repositoryName: string, tagName: string) {
    const registryMeta = this.registryMetas[acr];
    const clientId = 'cb7ec5ca-4b42-4c5c-b19f-a8768a97870a'; // process.env.AZURE_CLIENT_ID || '';
    const clientSecret = 'FxoyY1mKLzpj9KMvZzlJ2dsz6e-gr8pBXE'; // process.env.AZURE_CLIENT_SECRET || '';
    const azureCredential = new ClientSecretCredential(registryMeta.tenantId, clientId, clientSecret);
    const client = new ContainerRegistryClient(registryMeta.endpoint, azureCredential, {
      audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud
    });
    const repository = await client.getRepository(repositoryName);
    const result = { success: true, error: null as any };
    const artifact = repository.getArtifact(tagName);
    if (artifact) {
      try {
        await artifact.deleteTag(tagName);
      } catch (e) {
       this.log(`Failed to delete tag ${tagName} from repository: ${repositoryName} with error: ${e}`);
       result.success = false;
       result.error = e;
    }
  } else {
    result.success = false;
    result.error = `Cannot find tagName ${tagName}`;
  }
    return result;
  }
}
