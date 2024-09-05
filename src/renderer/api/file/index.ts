import { createAxiosService } from '/@/utils/request';

export async function readFile(baseUrl: string, url: string) {
	const axios = createAxiosService(baseUrl);
	const result = await axios.get(url);
	return result.data;
}
