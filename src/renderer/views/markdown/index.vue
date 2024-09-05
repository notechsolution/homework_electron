<template>
	<div id="markdown-container">
	</div>
</template>

<script lang="ts">

import { toRefs, reactive, defineComponent, onMounted } from 'vue';
import 'cherry-markdown/dist/cherry-markdown.css';
import Cherry from 'cherry-markdown';
import { saveFile, openFile } from '/@/service/file'
import _ from 'lodash';
import { ElNotification } from 'element-plus';

export default defineComponent({
	name: 'markdown-editor',
	setup() {
		const state = reactive({
			filePath: '',
			cherryInstance: null as unknown as Cherry
		});

		onMounted(() => {
			const openFileMenu = Cherry.createMenuHook('Open File', {
				iconName: 'folder-open',
				onClick: async () => {
					const result = await openFile();
					if (result.filePath) {
						state.filePath = result.filePath;
						state.cherryInstance.setMarkdown(result.content);
					}
				}
			});

			const saveFileMenu = Cherry.createMenuHook('Save', {
				iconName: 'folder',
				onClick: async () => {
					const result = await saveFile(state.filePath, state.cherryInstance.getValue());
					if (result.status === 'success') {
						ElNotification({
							title: 'Save Markdown File',
							type: 'success',
							message: `Save to ${result.filePath}`,
							duration: 10
						});
					}
				},
				shortcutKeys: ['Ctrl-s']
			});

			state.cherryInstance = new Cherry({
				id: 'markdown-container',
				value: '# Welcome to TECH markdown editor',
				externals: {
					echarts: window.echarts,
					katex: window.katex,
					MathJax: window.MathJax
				},
				toolbars: {
					toolbarRight: ['export', 'switchModel', 'fullScreen', '|'],
					customMenu: {
						openFile: openFileMenu,
						saveFile: saveFileMenu
					},
					toolbar: [
						'openFile',
						'saveFile',
						'|',
						'bold',
						'italic',
						{
							underline: ['strikethrough', 'underline', 'sub', 'sup', 'ruby']
						},
						'size',
						'|',
						'color',
						'header',
						'|',
						'drawIo',
						'|',
						'ol',
						'ul',
						'checklist',
						'panel',
						'justify',
						'detail',
						'|',
						'image',
						'code',
						'link',
						'formula',
						'graph',
						{
							insert: ['audio', 'video', 'hr', 'br', 'toc', 'table', 'pdf', 'word', 'ruby']
						},
						'|',
						'togglePreview',
						'codeTheme',
						'theme'
					]
				},
				engine: {
					syntax: {
						mathBlock: {
							engine: 'MathJax',
							src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js' // 如果使用MathJax将js在此处引入，katex则需要将js提前引入
						},
						inlineMath: {
							engine: 'MathJax' // katex或MathJax
						},
						emoji: {
							useUnicode: false,
							customResourceURL: 'https://github.githubassets.com/images/icons/emoji/unicode/${code}.png?v8',
							upperCase: true
						}
					}
				},
				drawioIframeUrl: './views/markdown/drawio.html'
			})
		});
		return {
			...toRefs(state)
		};
	}
});
</script>

<style>
iframe.cherry-dialog-iframe {
	width: 100%;
	height: 100%;
}
</style>
