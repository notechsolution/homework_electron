import { getService } from '/@/utils/request';

async function searchGSBNRetention(meta: any = {}, params: any = {}) {
	const requestService = getService(meta.coreNode, meta.env, meta.serviceName)
	const response = await requestService({
		url: '/api/txmgt/queryRetentionWithPaging',
		method: 'post',
		data: params
	});
return response?.data;
}

async function getGSBNOrganizations(meta: any = {}) {
	const requestService = getService(meta.coreNode, meta.env, meta.serviceName)
	const response = await requestService({
		url: '/api/organizations/associations',
		method: 'get'
	});
return response?.data;
}

export {
	searchGSBNRetention,
	getGSBNOrganizations
}
