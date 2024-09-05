import axios, { AxiosInstance } from 'axios';
// import { ElMessage, ElMessageBox } from 'element-plus';
// import { Session } from '/@/utils/storage';
import _ from 'lodash'
// import { request } from 'http';

const PM_ACS_SVC = 'pm_acs_svc';
const PM_CONSOLE_SVC = 'pm_console_svc';

const gsbnUrls = {
	sg: {
		int: {
			pm_acs_svc: 'https://gsbn-pm-acs-svc-int2-dcoresg.gsbn.network',
			pm_console_svc: 'https://gsbn-pm-console-svc-int2-dcoresg.gsbn.network'
		},
		prod: {
			pm_acs_svc: 'https://gsbn-pm-acs-svc.gsbn.network',
			pm_console_svc: 'https://gsbn-pm-console-svc.gsbn.network'
		}
	},
	ali: {
		int: {
			pm_acs_svc: 'https://gsbn-pm-acs-svc-int2-dcorecn.np.gsbn.cn',
			pm_console_svc: 'https://gsbn-pm-console-svc-int2-dcorecn.np.gsbn.cn'
		},
		prod: {
			pm_acs_svc: 'https://gsbn-pm-acs-svc.gsbn.cn',
			pm_console_svc: 'https://gsbn-pm-console-svc.gsbn.cn'
		}
	}
}

type serviceType = {
	[key: string]: AxiosInstance
}
const services: serviceType = {};

const getService = (coreNode: string = 'sg', env: string, serviceName: string) => {
	const serviceId = `${coreNode}_${env}_${serviceName}`;
	if (!services[serviceId]) {
		services[serviceId] = createAxiosService(_.get(gsbnUrls, [coreNode, env, serviceName]))
	}
	return services[serviceId];
}

const createAxiosService = (baseUrl: string) => {
	const service = axios.create({
		baseURL: baseUrl,
		timeout: 50000,
		headers: { 'Content-Type': 'application/json' }
	});
	return service;
}

const getOPCService = () => {
	const serviceId = 'csopc'
	const baseUrl = 'https://csopc.cargosmart.com'; // import.meta.env.VITE_CSOPC_URL as string;
	if (!services[serviceId]) {
		services[serviceId] = createAxiosService(baseUrl)
	}
	return services[serviceId];
}

// 导出 axios 实例
export { getService, PM_ACS_SVC, PM_CONSOLE_SVC, getOPCService, createAxiosService };
