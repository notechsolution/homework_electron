<template>
	<div>
		<el-card>
			<el-row justify="center">
				<el-select v-model="selectedRepositories" multiple filterable placeholder="All Repository"
					style="padding-right: 20px; width: 30%;">
					<el-option v-for="item in repositoryNames" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
				<el-button type="primary" v-on:click="searchRepository()" :loading="loading">Load Docker Images</el-button>
			</el-row>
		</el-card>
		<el-card>
			<template #header>
				<div class="card-header">
					<span>GSBN Client Docker Image</span>
				</div>
			</template>
			<el-table :data="repositories" style="width: 100%">
				<el-table-column type="expand">
					<template #default="props">
						<el-table :data="props.row.manifests" style="width: 80%; margin-left: 60px;" border
							@selection-change="handleSelectionChange" @select-all="disableSelectAll(props.row.name)"
							@expand-change="clearSelection(props.row.name)" :ref="props.row.name">
							<el-table-column type="selection" width="55" />
							<el-table-column label="Tag" prop="tags" :filters="[
								{ text: 'Tag', value: 'tag' },
								{ text: 'NoTag', value: 'blank' }
							]" :filtered-value="['tag']" :filter-method="filterHandler" />
							<el-table-column label="Digest" prop="digest" width="600" />
							<el-table-column label="Last Update Time" prop="lastUpdatedOn" />
							<el-table-column label="Operations">
								<template #default="scope">
									<div class="single-line-text-ellipsis">
										<el-button @click="copyImageUrl(props.row, scope.row)" size="small" circle :icon="CopyDocument"
											title="Copy Image URL"></el-button>
										<el-popconfirm title="Are you sure to delete this docker image tag?"
											v-if="scope.row.tags && scope.row.tags.length > 0" @confirm="deleteImageTag(props.row, scope.row)">
											<template #reference>
												<el-button size="small" circle :icon="Delete" title="Delete Tag"></el-button>
											</template>
										</el-popconfirm>
									</div>
								</template>
							</el-table-column>
						</el-table>

						<el-popconfirm title="Are you sure to delete selected docker image tag?"
							@confirm="deleteSelectedTags(props.row)">
							<template #reference>
								<el-button size="large" :icon="Delete" title="Delete Multiple Tags" type="danger"
									style="margin-left: 60px; margin-top: 20px;">Delele Selected Version</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
				<el-table-column label="Repository" prop="name" width="260" />
				<el-table-column label="Latest Tag" prop="latestTag" />
				<el-table-column label="Last Update Time" prop="lastUpdatedOn" />
				<el-table-column label="Tag Count" prop="tagCount" />
				<el-table-column label="Manifest Count" prop="manifestCount" />
				<el-table-column label="Docker Image URL" prop="dockerUrl" width="400" />

			</el-table>
		</el-card>
	</div>
</template>

<script lang="ts">

import _ from 'lodash';
// import { ElNotification } from 'element-plus';
import { TableColumnCtx } from 'element-plus/lib/components/table/src/table-column/defaults';
import { CopyDocument, Delete } from '@element-plus/icons-vue';
import { toRefs, reactive, defineComponent, ref } from 'vue';
import { listTags, deleteTag, foo } from '/@/service/azure/containerRegistry';
import { ElNotification } from 'element-plus';
import commonFunction from '/@/utils/commonFunction';

export default defineComponent({
	name: 'dockerImage',
	setup() {
		const state = reactive({
			repositories: [] as any,
			loading: false,
			selectedRepositories: [],
			selectedImageVersions: [],
			tableRefs: {} as any,
			repositoryNames: [
				'csbc-release/csbc_hm_biz_api',
				'csbc-release/csbc_hm_acs_svc',
				'csbc-release/csbc_encryptgo',
				'csbc-release/csbc_hm_console',
				'iqgw-release/csbc_hm_evt_hub',
				'iqgw-release/iqgw_admin_console',
				'iqgw-release/iqgw_gw_core'
			]
		});
		return {
			CopyDocument,
			Delete,
			copyText: commonFunction().copyText,
			...toRefs(state)
		};
	},
	methods: {
		async searchRepository() {
			console.log('foo:' + JSON.stringify(await foo()));
			this.loading = true;
			this.repositories = [];
			const that = this;
			let searchRepository = this.selectedRepositories as any;
			if (_.isEmpty(searchRepository)) {
				searchRepository = this.repositoryNames;
			}
			searchRepository.forEach((repository: string) => {
				const acr = this.getACR(repository);
				listTags(acr, repository).then(repository => {
					that.repositories.push(repository[0]);
					if (this.repositories.length === searchRepository.length) {
						that.loading = false;
						this.repositories = _.orderBy(this.repositories, 'name', 'asc');
					}
				})
			});
		},
		getACR(repositoryName: string) {
			if (_.startsWith(repositoryName, 'csbc-release/')) {
				return 'gsbnacr';
			}
			if (_.startsWith(repositoryName, 'iqgw-release/')) {
				return 'iqaxacr'
			}
			return '';
		},
		filterHandler(filterValue: string, row: any, column: TableColumnCtx<any>) {
			const property = column.property
			if (filterValue === 'blank') {
				return _.isEmpty(row[property])
			}
			if (filterValue === 'tag') {
				return !_.isEmpty(row[property])
			}
		},
		copyImageUrl(repository: any, manifest: any) {
			const baseImageUrl = `${repository.endpoint}/${repository.name}`;
			let suffix;
			if (!_.isEmpty(manifest.tags)) {
				suffix = `:${manifest.tags[0]}`;
			} else {
				suffix = `@${manifest.digest}`;
			}
			this.copyText(baseImageUrl + suffix);
		},
		async deleteImageTag(repository: any, manifest: any) {
			if (!_.isEmpty(manifest.tags)) {
				const baseImageUrl = `${repository.endpoint}/${repository.name}:${manifest.tags[0]}`;
				const acr = repository.endpoint.split('.')[0];
				console.log(`try to delete tag:${acr}, ${baseImageUrl}`);
				const result = await deleteTag(acr, repository.name, manifest.tags[0]);
				if (result.success) {
					ElNotification({
						title: 'Delete Tag',
						type: 'success',
						message: `Delete tag ${manifest.tags[0]} of ${repository.endpoint}/${repository.name} successfully`,
						duration: 10
					});
					_.remove(repository.manifests, function (m) {
						return _.get(m, 'digest') === manifest.digest
					})
				} else {
					ElNotification({
						title: 'Delete Tag',
						type: 'error',
						message: `Failed to delete ${baseImageUrl} from ${acr} ACR with error ${JSON.stringify(result.error)}`,
						duration: 0
					});
				}
			} else {
				ElNotification.warning('No tags found for this action, action is ignored');
			}
		},
		handleSelectionChange(selectedVersions: []) {
			this.selectedImageVersions = selectedVersions
		},
		async deleteSelectedTags(repository: any) {
			console.log(`hey repositry is ${JSON.stringify(repository.name)} and tags :${JSON.stringify(this.selectedImageVersions)}`)
			this.selectedImageVersions.forEach(async (imageTag) => {
				if (_.get(imageTag, 'repository') === repository.name) {
					console.log(`trying to delete ${repository.name} - ${JSON.stringify(imageTag.tags)}`)
					await this.deleteImageTag(repository, imageTag);
				}
			})
		},
		disableSelectAll(repository: string) {
			const refTable = _.get(this.$refs, repository) as any;
			if (refTable) {
				refTable.clearSelection();
				ElNotification.warning('删库跑步? 善哉善哉! 但凡有办法我就不会显示这个select all的button!');
			}
		},
		clearSelection(repository: string) {
			const refTable = _.get(this.$refs, repository) as any;
			if (refTable) {
				refTable.clearSelection();
			}
		}
	}
});
</script>
