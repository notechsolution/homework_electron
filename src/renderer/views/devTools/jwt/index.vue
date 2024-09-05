<template>
  <div style="margin: 10px;" class="jwt-div">
    <el-container>
      <el-header><span style="font-weight: 900">JWT Debugger</span></el-header>
      <el-container>
        <el-aside width="40%">
					<el-input
							v-model="encodedToken"
							:autosize="{ minRows: 33}"
							type="textarea"
							placeholder="Please input JWT token string"
							@change="parseJWT"
						/>
				</el-aside>
        <el-main>
					 <el-collapse v-model="activeNames">
					  <el-collapse-item name="1">
								<template #title>
									<span class="el-card__header" style="font-weight: 700">HEADER:</span><span style="font-size: 10px;">ALGORITHM & TOKEN TYPE</span>
								</template>
								<div ref="headerJsonDiv"></div>
						</el-collapse-item>
						<el-collapse-item  name="2">
							<template #title>
									<span class="el-card__header" style="font-weight: 700">PAYLOAD:</span><span style="font-size: 10px;">BODY</span>
								</template>
							<div ref="payloadJsonDiv" style="height: 435px;"></div>
						</el-collapse-item>
						<el-collapse-item  name="3">
							<template #title>
									<span class="el-card__header" style="font-weight: 700">VERIFY SIGNATURE</span>
								</template>
						</el-collapse-item>
					 </el-collapse>
				</el-main>
      </el-container>
		<!-- <el-button type="primary" v-on:click="parsePdf" :loading="loading" >Parse PDF</el-button> -->
    </el-container>
  </div>
</template>

<script lang="ts">

import { toRefs, reactive, defineComponent, onMounted, ref } from 'vue';
import jwtDecode, { JwtPayload, JwtHeader } from 'jwt-decode';
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js'
import 'jsoneditor/dist/jsoneditor.min.css'

const dateFields = ['iat', 'exp', 'nbf']
export default defineComponent({
  name: 'dockerImage',
  setup() {
    const state = reactive({
				encodedToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
				loading: false,
				activeNames: ['1', '2', '3'],
				jwtHeader: {} as JwtHeader,
				jwtPayload: {} as JwtPayload,
				headerJsonEditor: {} as any,
				payloadJsonEditor: {} as any
    });
		const headerJsonDiv = ref(HTMLDivElement);
		const payloadJsonDiv = ref(HTMLDivElement);
		function decodeJWT() {
			state.jwtHeader = jwtDecode<JwtHeader>(state.encodedToken, { header: true });
			state.jwtPayload = jwtDecode<JwtPayload>(state.encodedToken);
		}
		onMounted(() => {
			decodeJWT();
			// refer to https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options
			const options = {
				mode: 'view',
				modes: ['view', 'code', 'text'],
				mainMenuBar: false,
				navigationBar: false,
				statusBar: false,
				timestampTag: function ({ field, value, path }:{field: string, value: any, path: string}) {
						if (dateFields.includes(field)) {
							return true
						}

						return false
					},
				timestampFormat: function ({ field, value, path }:{field: string, value: any, path: string}) {
					if (dateFields.includes(field)) {
						return new Date(value * 1000).toString()
					}

					return null
				}
			}
			state.headerJsonEditor = new JSONEditor(headerJsonDiv.value, options, state.jwtHeader)
			state.payloadJsonEditor = new JSONEditor(payloadJsonDiv.value, options, state.jwtPayload)
			const payloadSchema = {
						$schema: 'http://json-schema.org/draft-07/schema#',
						properties: {
								exp: {
										description: 'The exp (expiration time) claim identifies the expiration time on or after which the token MUST NOT be accepted for processing'
								},
								iat: {
										description: 'The iat (issued at) claim identifies the time at which the JWT was issued'
								},
								nbf: {
										description: 'The nbf (not before) claim identifies the time before which the token MUST NOT be accepted for processing'
								},
								iss: {
									description: 'The iss (issuer) claim identifies the principal that issued the JWT'
								},
								aud: {
									description: 'The aud (audience) claim identifies the audience that the JWT is intended for'
								},
								prn: {
									description: 'The prn (principal) claim identifies the subject of the JWT'
								},
								jti: {
									description: 'The jti (JWT ID) claim provides a unique identifier for the JWT'
								},
								typ: {
									description: 'The typ (type) claim is used to declare a type for the contents of this JWT Claims Set'
								}
						},
						type: 'object'
				}
			state.payloadJsonEditor.setSchema(payloadSchema);
			});

		const parseJWT = () => {
			console.log('parseJWT');
				decodeJWT();
				state.headerJsonEditor.set(state.jwtHeader);
				state.payloadJsonEditor.set(state.jwtPayload);
		};
		// const parsePdf = async () => {
		// 	const { ipcRenderer } = (window as any)?.electron;
		//   const result = await ipcRenderer.invoke('service:call', 'FooService', 'parsePdf');
		// 	console.log(JSON.stringify(result))
		// }
    return {
      ...toRefs(state),
			headerJsonDiv,
			payloadJsonDiv,
			parseJWT
			// parsePdf
    };
  }
});
</script>

<style scoped>
  .jwt-div .el-header, .el-footer {
    background-color: #cfdae7;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .jwt-div .el-aside {
    color: #333;
    text-align: center;
    line-height: 200px;
		padding-top: 20px;
  }

  .jwt-div .el-main {
    color: #333;
    line-height: 160px;
  }

  .jwt-div .el-container:nth-child(5) .el-aside,
  .jwt-div .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .jwt-div .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
	.jwt-div >>> .jsoneditor{
		border: thin solid #e0e6ef!important;
	}
	</style>
