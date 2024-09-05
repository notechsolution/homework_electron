import { getOPCService } from '/@/utils/request';

async function searchBusinessKey(businessKey: string) {
	const requestService = getOPCService()
	const secret = '__df58cjyz48000__'; // import.meta.env.VITE_CSOPC_SECRET as string;
	const url = `/dftdom/api/external/searchByBusinessKey?businessKey=${businessKey}`;
	const response = await requestService({
		url,
		method: 'get',
		headers: { 'opc-api-secret': secret }
	});
	return response?.data;
}

export {
	searchBusinessKey
}
