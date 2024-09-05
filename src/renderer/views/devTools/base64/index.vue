<template>
	<div style="margin: 10px;" class="jwt-div">
		<el-container>
			<el-header><span style="font-weight: 900">Base 64 Encoder and Decoder</span></el-header>
			<el-card>
				<el-row justify="center">
					<el-select v-model="convertionMode" style="padding-right: 20px;" @change="convert">
						<el-option key="Encode" label="Encode" value="Encode" />
						<el-option key="Decode" label="Decode" value="Decode" />
					</el-select>
					<el-select v-model="characterSet" style="padding-right: 20px;">
						<el-option key="UTF-8" label="UTF-8" value="utf8" />
					</el-select>
				</el-row>
			</el-card>
			<el-row :gutter="20">
				<el-col :span="10">
					<el-row class="inner-header">
						<el-col :span="6">
							<label>Input:</label>
						</el-col>
						<el-col :span="2" :offset="16" style="text-align: right">
							<el-button @click="copyText(inputContent)" size="small" :icon="CopyDocument" title="Copy Input"></el-button>
						</el-col>
					</el-row>
					<el-row>
						<el-input v-model="inputContent" :autosize="{ minRows: 30 }" type="textarea"
							placeholder="Type ot paste content here..." @change="convert" />
					</el-row>
				</el-col>
				<el-col :span="13">
					<el-row class="inner-header">
						<el-col :span="6">
							<label>Output:</label>
						</el-col>
						<el-col :span="2" :offset="16" style="text-align: right">
							<el-button @click="copyText(outputContent)" size="small" :icon="CopyDocument"
								title="Copy Output"></el-button>
						</el-col>
					</el-row>
					<el-row>
						<el-input v-model="outputContent" :autosize="{ minRows: 30 }" type="textarea" disabled
							placeholder="Result goes here" />
					</el-row>
				</el-col>
			</el-row>
		</el-container>
	</div>
</template>

<script lang="ts">

import { toRefs, reactive, defineComponent, onMounted, ref } from 'vue';
import commonFunction from '/@/utils/commonFunction';
import { CopyDocument } from '@element-plus/icons-vue';

export default defineComponent({
	name: 'dockerImage',
	setup() {
		const state = reactive({
			loading: false,
			inputContent: 'SnVzdCBlbmpveSB5b3VyIGR1bWthIQ==',
			outputContent: '',
			convertionMode: 'Decode',
			characterSet: 'utf8'
		});
		onMounted(() => {
			// refer to https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options
			convert();
		});

		const convert = () => {
			state.outputContent = state.inputContent;
			console.log(`state.conversion is ${state.convertionMode}`)
			if (state.convertionMode === 'Decode') {
				state.outputContent = Buffer.from(state.inputContent, 'base64').toString('utf8');
			} else {
				state.outputContent = Buffer.from(state.inputContent, 'utf8').toString('base64');
			}
		};
		return {
			...toRefs(state),
			convert,
			CopyDocument,
			copyText: commonFunction().copyText
		};
	}
});
</script>

<style scoped>
.jwt-div .el-header,
.el-footer {
	background-color: #cfdae7;
	color: #333;
	text-align: center;
	line-height: 60px;
}

.inner-header {
	padding: 1rem;
}
</style>
