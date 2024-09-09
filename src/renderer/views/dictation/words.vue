<script setup>
import { getWords, getBooks } from '/@/service/dictation';
import { onMounted, ref } from 'vue';
import printJS from 'print-js';
import _ from 'lodash';
import html2pdf from 'html2pdf.js';
import moment from 'moment';
import { sendEmail } from '/@/service/email';

const groups = ref([])
const search = ref({
  book: '',
  units: ['before'],
  currentUnit: '',
  page: 1,
  today: moment().toDate()
});
const books = ref([])
const bookNames = ref([]);
const units = ref([]);
onMounted(() => {
  console.log('mounted');
  // getWords().then((res) => {
  //   groups.value = res;
  // }).catch(error => {
  //   console.error(error);
  // });
  getBooks().then((data) => {
    books.value = data;
    bookNames.value = data.map(item => item.name);
  }).catch(error => {
    console.error(error);
  });
})

const updateUnits = function () {
  const book = books.value.find(item => item.name === search.value.book);
  console.log(`getUnits  ${search.value.book} ${book}`);
  units.value = book ? book.units : [];
}

const chooseUnits = function (value) {
  console.log('chooseUnits:' + value);
  if (_.last(value) === 'before') {
    search.value.units = ['before'];
  } else if (_.includes(search.value.units, 'before') && search.value.units.length > 1) {
    _.remove(search.value.units, (unit) => unit === 'before');
  }
}
// print the section of dictation-paper
const print = () => {
  // change the page tile with current date
  document.title = `${document.title}-${moment(search.value.today).format('YYYY-MM-DD')}`;
  showInlineTitle.value = false;
  printJS({
    printable: 'dictation-page',
    type: 'html',
    targetStyles: ['*'],
    header: '英语单词练习纸',
    headerStyle: 'font-size: 22px; text-align: center; margin-top:-25px; margin-bottom: 10px; letter-spacing: 5px;',
    onPrintDialogClose: () => {
      showInlineTitle.value = true;
    }
  });
}
const generate = () => {
  console.log('generate');
  const originUnits = search.value.units
  if (search.value.units.length > 0 && _.includes(search.value.units, 'before')) {
    search.value.units = [];
    for (let i = 1; i < search.value.currentUnit; i++) {
      search.value.units.push(i);
    }
  }
  getWords(search.value).then((res) => {
    groups.value = res;
    search.value.units = originUnits;
  }).catch(error => {
    console.error(error);
  });
}

const showInlineTitle = ref(false);
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
    const filename = `单词-${moment(search.value.today).format('YYYY-MM-DD')}.pdf`;
    sendEmail('dng71248p3jhh2@print.rpt.epson.com.cn', filename, '单词练习', null, { filename, content: pdf });
    showInlineTitle.value = false;
  });
  // html2pdf().set(opt).from(element).save();
  // showInlineTitle.value = false;
}

</script>

<template>
  <div>
    <div class="search-section">
      <el-form :model="search">
        <el-form-item label="英语书:">
          <el-select v-model="search.book" placeholder="选择英语书" style="width: 230px;" class="search-box" @change="updateUnits">
            <el-option
              v-for="bookName in bookNames"
              :key="bookName"
              :label="bookName"
              :value="bookName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row style="margin-bottom: 20px">
          <el-form-item label="选单词:">
            <el-form-item label="当前进度">
              <el-select v-model="search.currentUnit" placeholder="当前学习单元" style="width: 150px;" class="search-box">
                <el-option
                  v-for="unit in units"
                  :key="unit"
                  :label="`第${unit}单元`"
                  :value="unit"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="补充单词">
              <el-select v-model="search.units" placeholder="选择其他单元" style="width: 300px;" multiple class="search-box" @change="chooseUnits"
                         clearable>
                <el-option key="before" label="已学单元" value="before"></el-option>
                <el-option
                  v-for="unit in units"
                  :key="unit"
                  :label="`第${unit}单元`"
                  :value="unit"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-row>
        <el-form-item label="总页数:">
          <el-input-number v-model="search.page" :min="1" :max="10"/>
          <el-text class="mx-1" type="warning" style="padding-left: 5px"> * 默认一页40个单词</el-text>
        </el-form-item>
        <el-form-item label="选时间:">
          <el-date-picker
            v-model="search.today"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-row justify="end">
          <el-button type="primary" @click="generate">生成</el-button>
          <el-button @click="print">本地打印</el-button>
          <el-button @click="saveAsPDF">远程打印</el-button>
        </el-row>
      </el-form>
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
          <div style="width: 150px"> {{ moment(search.today).format('YYYY-MM-DD') }}</div>
        </div>
      </div>
      <div class="dictation-section">
        <div v-for="(group, index) in groups" :key="words" class="line-group">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line-red"></div>
          <div class="line"></div>
          <div class="chinese">({{ group.chinese }})</div>
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
  width: 780px; /* 210mm * (96 / 25.4) */
  //height: 1123px; /* 297mm * (96 / 25.4) */
}

.dictation-section {
  display: flex;
  flex-wrap: wrap;
}

.line-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 17px;
  margin-right: 20px;
  width: 160px;
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
  font-size: 16px;
  text-align: center;
}

.search-box {
  margin-right: 20px;
}

.search-section {
  display: flex;
  margin: 20px;
  margin-bottom: 0;
  align-items: center;
}

.dictation-paper-header {
  display: flex;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%
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
