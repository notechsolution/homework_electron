<template>
	<div class="form-adapt-container">
			<el-card shadow="hover" header="Transaction">
				<el-form :model="criteria" size="default" class="mt35 mb35">
					<el-row :gutter="35" label-width="150px">
						<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
							<el-form-item label="Environment">
								<el-select v-model="criteria.environment" placeholder="GSBN Environment" clearable class="w100">
									<el-option label="INT" value="int"></el-option>
									<el-option label="Production" value="prod"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="7" class="mb20">
							<el-form-item label="GSBN Transaction ID">
								<el-input v-model.trim="criteria.transanctionId" placeholder="Input GSBN Transaction ID" clearable @keyup.enter="searchTransaction"></el-input>
							</el-form-item>
						</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="7" class="mb20">
							<el-form-item label="GSBN Asset ID">
								<el-input v-model.trim="criteria.assetId" placeholder="Input Asset ID" clearable @keyup.enter="searchTransaction"></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="mb20">
							<el-form-item label="Core Node">
								<el-select v-model="criteria.coreNodeId" placeholder="Choose Core Node if possible" clearable class="w100">
									<el-option label="Core Platform - SG" value="sg"></el-option>
									<el-option label="China Platform - ALI" value="ali"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						</el-row>
						<el-row>
						<el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
							<el-form-item>
								<el-button type="primary" v-on:click="searchTransaction">
									<SvgIcon name="ele-Search" />
									Search
								</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
				<el-collapse style="margin-top:10px" v-model="rententionCard" v-if="resultCard">
						<el-collapse-item name="1">
								<template #title>
								<span class="el-card__header" style="font-weight: 700">{{retentionTitle}}</span>
								</template>
								<ul v-if="retentions">
									<el-card  v-for="retention in retentions" :key="retention.transaction">
										<el-descriptions
												direction="vertical"
												:column="6"
												size="large"
												border>
											<el-descriptions-item label="GSBN Transaction ID">{{retention.transaction}}</el-descriptions-item>
											<el-descriptions-item label="Asset ID">{{retention.assetId}}</el-descriptions-item>
											<el-descriptions-item label="Asset Type">{{retention.assetType}}</el-descriptions-item>
											<el-descriptions-item label="Asset Version">{{retention.assetVersion}}</el-descriptions-item>
											<el-descriptions-item label="Transaction Dates">
												<el-row><el-col :span="6">Created:</el-col><el-col :span="18">{{retention.createdAt}}</el-col></el-row>
												<el-row><el-col :span="6">Completed:</el-col><el-col :span="18">{{retention.completedAt}}</el-col></el-row>
											</el-descriptions-item>
											<el-descriptions-item label="Transaction Status">
												<el-tag :type="getStatusType(retention.overallStatus)">{{retention.overallStatus}}</el-tag>
											</el-descriptions-item>
											<el-descriptions-item label="Sender Organization" span="3">{{retention.senderOrg.orgId}} (<b>{{retention.senderOrg.orgName}}</b>)</el-descriptions-item>
											<el-descriptions-item label="Receiver Organization" span="3">
												<el-row v-for="recipientOrg in retention.recipientOrgs" :key="recipientOrg">
												{{recipientOrg.orgId}} (<b>{{recipientOrg.orgName}}</b>)
												</el-row>
											</el-descriptions-item>
											<el-descriptions-item label="Asset LocatorKey" span="6"
												>{{retention.locatorKey}}
											</el-descriptions-item>
											<el-descriptions-item label="RoleList LocatorKey" span="6"
												>{{retention.roleListLocatorKey}}
											</el-descriptions-item>
										</el-descriptions>
									</el-card>
							</ul>
							<el-card v-if="!retentions">
								 <el-empty description="No record found in GSBN Retention table!"></el-empty>
							</el-card>
					</el-collapse-item>
		</el-collapse>
 <!-- CSOPC search dialog -->
		<el-dialog v-model="opcFormVisible" title="No result in retentions. Please input to search CSOPC" draggable="true">
			<el-form>
				<el-form-item label="Business Key" :label-width="100">
					<el-input v-model="businessKey" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="opcFormVisible = false">Cancel</el-button>
					<el-button type="primary" @click="searchCSOPC"
						>Confirm</el-button
					>
				</span>
			</template>
  </el-dialog>
<!-- End of CSOPC Search Dialog -->

<!-- CSOPC Result -->
	<el-collapse style="margin-top:10px" v-if="csopcTableVisible" v-model="csopcActive">
						<el-collapse-item name="1">
								<template #title>
								<span class="el-card__header" style="font-weight: 700">CS OPC Search Result</span>
								</template>
								<el-form style="margin-left: 20px;" :inline="true" size="default">
									<el-form-item label="Business Key" :label-width="100" style="width: 500px;">
										<el-input v-model="businessKey" autocomplete="off" ></el-input>
									</el-form-item>
									<el-form-item style="margin-bottom: 18px !important;">
										<el-button type="primary" @click="searchCSOPC">Search</el-button>
									</el-form-item>
							</el-form>
								 <el-table :data="csopcRecords" style="width: 100%" :row-class-name="tableRowClassName">
										<el-table-column prop="traceId" label="Trace ID" width="700"/>
										<el-table-column prop="status" label="Status" width="100"/>
										<el-table-column prop="gsbnHome" label="GSBN Home"  width="150"/>
										<el-table-column prop="messageType" label="Message Type"  width="150"/>
										<el-table-column prop="createdAt" label="Created Time" sortable/>
										<el-table-column label="Operations" >
										<template #default="scope">
											<div class="single-line-text-ellipsis">
												<el-button
													@click="searchApplicationInsight(scope.row)"
													size="small"
													circle
													:icon="Search"
													title="Search Application Insight"
												></el-button>
											</div>
										</template>
									</el-table-column>
									</el-table>
					</el-collapse-item>
		</el-collapse>
<!-- End of CSOPC Result -->

	</div>
</template>

<script lang="ts">

import { ElMessage } from 'element-plus';
import { upperCase, isEmpty, orderBy } from 'lodash';
import { toRefs, reactive, defineComponent, computed } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { blindSearchGSBNRetention, searchBusinessKeyFromCSOPC } from '/@/service/troubleshooter'
import { queryApplicationInsight } from '/@/service/azure/applicationInsight'

export default defineComponent({
  name: 'transactionForm',
  setup() {
    const state = reactive({
      criteria: {
        transanctionId: '',
        coreNodeId: '',
				environment: 'prod',
				assetId: ''
      },
			resultCard: false,
			retentions: [] as any,
			fromCoreNode: '',
			rententionCard: '1',
			opcFormVisible: false,
			csopcTableVisible: true,
			businessKey: '',
			csopcRecords: [] as any,
			csopcActive: '1'
		});

		const retentionTitle = computed(() => {
 				return `From ${upperCase(state.fromCoreNode)} Platform Retention`;
		});
    return {
			retentionTitle,
			Search,
      ...toRefs(state)
    };
  },
	methods: {
		async searchTransaction() {
			const criteria = { transanctionId: this.criteria.transanctionId, assetId: this.criteria.assetId, dateRange: [] }
			const result = await blindSearchGSBNRetention(this.criteria.coreNodeId, this.criteria.environment, criteria);
			this.retentions = result?.retentions;
			this.fromCoreNode = result?.coreNode || '';
			this.resultCard = true;
			this.rententionCard = '1';
			if (isEmpty(this.retentions)) {
				this.opcFormVisible = true;
			}
		},
		getStatusType(status:string) {
			switch (status) {
				case 'FAILED': return 'danger';
				case 'PUBLISHED': return 'success';
				default: return ''
			}
		},
		async searchCSOPC() {
			this.opcFormVisible = false;
			this.rententionCard = '';
			this.csopcTableVisible = true;
			const result = await searchBusinessKeyFromCSOPC(this.businessKey)
			this.csopcRecords = orderBy(result?.data, ['createdAt'], 'desc');
		},
		tableRowClassName({ row, rowIndex }:{row: any, rowIndex: number}) {
			if (row.status === 'FAILED' || row.status === 'PENDING') {
				 return 'warning-row'
			}
			return ''
		},
		async searchApplicationInsight(csopcRecord: any) {
			const result = await queryApplicationInsight(csopcRecord.traceId);
			ElMessage.info(JSON.stringify(result));
		}
	}
});
</script>
<style lang="scss">
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light);
}
</style>
