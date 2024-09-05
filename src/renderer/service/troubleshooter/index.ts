import { searchGSBNRetention, getGSBNOrganizations } from '/@/api/troubleshooter/gsbnAPI';
import { searchBusinessKey } from '/@/api/troubleshooter/csopcAPI';
import { PM_ACS_SVC, PM_CONSOLE_SVC } from '/@/utils/request'
import { Session } from '/@/utils/storage';
import _ from 'lodash';

async function blindSearchGSBNRetention(coreNode: string, env: string, criteria: any = {}) {
	const coreNodes = coreNode ? [coreNode] : ['sg', 'ali'];
	const params = { idFilter: criteria.transanctionId || criteria.assetId, curPageNum: 0, pageSize: 10, dateRange: criteria.dateRange || [] }
	for (let i = 0; i < coreNodes.length; i++) {
		const coreNode = coreNodes[i];
		const metaInfo = { coreNode, env, serviceName: PM_ACS_SVC };
		const response = await searchGSBNRetention(metaInfo, params);
		const organizationInfos = await getOrganizationInfos();
		if (response.code === 10000000 && !_.isEmpty(response.data)) {
			const retentions = _convertForDisplay(coreNode, response.data, organizationInfos)
			return { coreNode, retentions };
		}
	}
}

function _convertForDisplay(coreNode: string, items: [any], organizationInfos: any) {
	return _.map(items, item => {
		const senderOrg = organizationInfos?.[item.senderOrgId];
		const recipientOrgs = _.map(_.split(item.recipientOrgIds, ','), orgId => {
			const org = organizationInfos?.[orgId];
			return { orgId: orgId, orgName: org?.name };
		})
		return {
			coreNode,
			transaction: item.trxId,
			assetId: item.objId,
			assetType: item.assetType,
			assetVersion: item.version,
			senderOrg: { orgId: item.senderOrgId, orgName: senderOrg?.name },
			recipientOrgs,
			locatorKey: item.locatorKey,
			roleListLocatorKey: item.roleListLocatorKey,
			overallStatus: item.overallStatus,
			createdAt: item.createdAt,
			completedAt: item.completedOn
		}
	})
}

async function getOrganizationInfos() {
	if (!Session.get('organizationInfos')) {
		const response = await _getAllOrganizationInfo();
		if (response.code === 10000000 && !_.isEmpty(response.data)) {
			const organizationInfos = _.keyBy(response.data, 'gsbnOrgId')
			Session.set('organizationInfos', organizationInfos);
		}
	}
	return Session.get('organizationInfos');
}

async function searchBusinessKeyFromCSOPC(businessKey: string) {
	return searchBusinessKey(businessKey)
}

async function _getAllOrganizationInfo() {
	const meta = { coreNode: 'sg', env: 'int', serviceName: PM_CONSOLE_SVC };
	return getGSBNOrganizations(meta);
}
export {
	blindSearchGSBNRetention,
	getOrganizationInfos,
	searchBusinessKeyFromCSOPC
}
