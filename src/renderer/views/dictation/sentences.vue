<script setup>
import { onMounted, ref } from 'vue';
import printJS from 'print-js';
import moment from 'moment';
import html2pdf from 'html2pdf.js';
import { sendEmail,isMailServiceReady } from '/@/service/email';
import { Delete } from '@element-plus/icons-vue';
import _ from 'lodash';

const sentences = ref([{
  count: 2,
  content1: '',
  content2: ''
}])

const today = ref(moment().toDate());
const groups = ref([])
const showInlineTitle = ref(false);
const enableMailPrint = ref(false);
// print the section of dictation-paper
const print = () => {
  document.title = `${document.title}-${moment(today.value).format('YYYY-MM-DD')}`;
  showInlineTitle.value = false;
  printJS({
    printable: 'dictation-page',
    type: 'html',
    targetStyles: ['*'],
    header: '英语句子练习纸',
    headerStyle: 'font-size: 22px; text-align: center; margin-top:-25px; margin-bottom: 10px; letter-spacing: 5px;',
    onPrintDialogClose: () => {
      showInlineTitle.value = true;
  }
  });
}

const generate = () => {
  groups.value = sentences.value;
  // store the sentences into local storage
  localStorage.setItem('dictation-sentences', JSON.stringify(sentences.value));
}

const addSentence = (count) => {
  sentences.value.push({
    count: count,
    content1: '',
    content2: ''
  });
}

const removeSentence = (sentence) => {
  _.remove(sentences.value, sentence);
}

onMounted(() => {
  const sentencesInLocal = localStorage.getItem('dictation-sentences');
  if (sentencesInLocal) {
    sentences.value = JSON.parse(sentencesInLocal);
  }
  isMailServiceReady().then(res => {
    console.log('mail service readiness:' + res);
    enableMailPrint.value = res;
  }).catch(error => {
    console.error(error);
  });
})

const saveAsPDF = () => {
  showInlineTitle.value = true;
  const element = document.getElementById('dictation-page');
  const opt = {
    margin: [0.1, 0.3, 0.1, 0.3],
    filename: 'myfile.pdf',
    image: {
      type: 'jpeg',
      quality: 1
    },
    html2canvas: { scale: 2 },
    jsPDF: {
      unit: 'in',
      format: 'a4',
      orientation: 'portrait'
    }
  };
  html2pdf().set(opt).from(element).outputPdf('arraybuffer').then(function(pdf) {
    const filename = `句子-${moment(today.value).format('YYYY-MM-DD')}.pdf`;
    sendEmail(null, filename, '句子练习', null, { filename, content: pdf });
    showInlineTitle.value = false;
  });
}
</script>

<template>
  <div>
    <div class="search-section">
      <el-row style="width:100%;">
        <el-col :span="16">
          <el-row>
            <el-form>
              <el-form-item label="选时间:">
                <el-date-picker
                  v-model="today"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item>
                <div v-for="(sentense, index) in sentences" style="margin-bottom: 5px">
                  <div v-if="sentense.count === 2">
                    <el-text size="default">问题：</el-text>
                    <el-input v-model="sentense.content1" placeholder="请输入问题" class="input-with-select" style="width: 360px;margin-right: 10px"
                              size="large"></el-input>
                    <el-text size="default">回答：</el-text>
                    <el-input v-model="sentense.content2" placeholder="请输入回答" class="input-with-select" style="width: 360px"
                              size="large"></el-input>
                    <el-button type="danger" :icon="Delete" circle size="small" style="margin-left: 10px" @click="removeSentence(sentense)"/>
                  </div>
                  <div v-if="sentense.count === 1">
                    <el-text>句子：</el-text>
                    <el-input v-model="sentense.content1" placeholder="请输入句子" class="input-with-select" style="width: 730px"
                              size="large"></el-input>
                    <el-button type="danger" :icon="Delete" circle size="small" style="margin-left: 10px" @click="removeSentence(sentense)"/>
                  </div>
                </div>

              </el-form-item>
            </el-form>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row justify="end">
            <el-button type="success" @click="addSentence(2)">加问答句</el-button>
            <el-button type="success" @click="addSentence(1)">加陈述句</el-button>
            <el-button type="primary" @click="generate">生成</el-button>
            <el-button @click="print">本地打印</el-button>
            <el-button @click="saveAsPDF" v-if="enableMailPrint">远程打印</el-button>
          </el-row>
        </el-col>

      </el-row>

    </div>
    <div class="dictation-paper" id="dictation-page" v-if="groups.length>0">
      <div class="dictation-title" v-if="showInlineTitle">英语单词练习纸</div>
      <div class="dictation-paper-header">
        <div class="name-group">
          <div class="name">姓名：</div>
          <div class="line" style="width: 150px;"></div>
        </div>
        <div class="name-group">
          <div class="name">日期：</div>
          <div style="width: 150px"> {{ moment(today).format('YYYY-MM-DD') }}</div>
        </div>
      </div>
      <div class="dictation-section">
        <div v-for="(sentence, index) in groups" :key="index" style="width: 100%">
          <div v-if="sentence.count===2" style="display: flex">
            <div class="half-line-group">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line-red"></div>
              <div class="line"></div>
              <div class="chinese">({{ sentence.content1 }})</div>
            </div>
            <div class="half-line-group">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line-red"></div>
              <div class="line"></div>
              <div class="chinese">({{ sentence.content2 }})</div>
            </div>
          </div>
          <div v-if="sentence.count===1" class="whole-line-group">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line-red"></div>
            <div class="line"></div>
            <div class="chinese">({{ sentence.content1 }})</div>
          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.dictation-paper {
  //display: flex;
  ////align-items: center;
  //flex-wrap: wrap;
  margin: 20px;
  width: 794px; /* 210mm * (96 / 25.4) */
  //height: 1123px; /* 297mm * (96 / 25.4) */
}

.dictation-section {
  display: flex;
  flex-wrap: wrap;
}

.whole-line-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-right: 20px;
  width: 96%;
}

.half-line-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-right: 20px;
  width: 48%;
}

.line {
  border-bottom: 1px solid grey;
  margin: 6px 0;
}

.line-red {
  border-bottom: 1px solid mediumvioletred;
  margin: 6px 0;
}

.chinese {
  font-size: 18px;
  text-align: center;
}

.search-box {
  margin-right: 20px;
}

.search-section {
  //display: flex;
  margin: 20px;
  margin-bottom: 0;
  align-items: center;
}

.dictation-paper-header {
  display: flex;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.dictation-title {
  font-size: 20px;
  text-align: center;
  display: block;
  margin-bottom: 15px;
  letter-spacing: 5px;
}

.name {
  margin-left: 10px;
  width: 50px;
}

.name-group {
  display: flex;
  align-items: baseline;
  margin-right: 20px;
}
</style>
