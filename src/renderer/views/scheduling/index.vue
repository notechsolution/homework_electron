<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment';
import _ from 'lodash';
import { solarToLunar } from 'vue-solar-lunar';
import { getChineseHoliday } from '/@/service/holiday/index';

const schedules = ref([])
const criteria = ref({
  current: new Date(),
  interval: 25,
  months: 3
});
const calendars = ref([]);

let holidays = null;
onMounted(() => {
  console.log('mounted');
  getChineseHoliday().then(res => {
    holidays = res;
    console.log(holidays);
  })
})

const calculate = function () {
  // 当前值班为9月27日，每24天轮换一次， 计算未来半年的值班日期
  if (criteria.value.current === null) {
    return;
  }
  const range = criteria.value.months * 30;
  schedules.value = [];
  for (let i = 0; i < range / criteria.value.interval; i++) {
    const next = moment(criteria.value.current).add(i * criteria.value.interval, 'day');
    const dateStr = next.format('YYYY-MM-DD');
    const lunar = solarToLunar(next.year(), next.month() + 1, next.date());
    schedules.value.push({ date: next.toDate(), dateStr: dateStr, lunar: lunar });
  }

  // calendars should be arrays of each future month of criteria.value.months
  calendars.value = [];
  for (let i = 0; i < criteria.value.months; i++) {
    const next = moment().add(i, 'month');
    next.date(1);
    calendars.value.push(next.toDate());
  }
}

const getLunar = function (date) {
  const solar = moment(date);
  return solarToLunar(solar.year(), solar.month() + 1, solar.date());
}

const renderSecondLine = function (data) {
  if (!_.isEmpty(holidays)) {
    // if any holiday's days include date
    const holiday = holidays.find(item => item.days.includes(data.day));
    if (holiday) {
      return `${holiday.name}`;
    }
  }
  const lunar = getLunar(data.date);
  if (lunar.Terms) {
    return `${lunar.Terms}`;
  }
  if (lunar.dayStr === '初一') {
    return `${lunar.monthStr}`;
  }
  return `${lunar.dayStr}`;
}

const isCompDay = function (day) {
  const holiday = holidays.find(holiday => holiday.compDays.includes(day));
  if (holiday) {
    return true;
  }
  return false;
}

const isHoliday = function (day) {
  const holiday = holidays.find(holiday => holiday.days.includes(day));
  if (holiday) {
    return true;
  }
  return false;
}

// const getTerms = function (date) {
//   const lunar = getLunar(date);
//   return lunar.Terms;
// }

const getClassName = (day) => {
  // is scheduled date
  const data = schedules.value.find(item => item.dateStr === day);
  if (data) {
    return 'scheduled is-selected calendar-day';
  }
  return 'calendar-day';
}

const onScheduled = (day) => {
  return schedules.value.find(item => item.dateStr === day);
}

</script>

<template>
  <div>
    <div class="search-section">
      <el-form :model="criteria" inline>
        <el-form-item label="最近一次值班日期:">
          <el-date-picker
              v-model="criteria.current"
              type="date"
              placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="排班周期">
          <el-input v-model="criteria.interval" style="width: 50px; padding-right: 5px"></el-input> <el-text> 天</el-text>
        </el-form-item>
        <el-form-item label="推算多久">
          <el-select v-model="criteria.months" placeholder="月数" style="width: 150px;" class="search-box">
            <el-option
                v-for="unit in 6"
                :key="unit"
                :label="`${unit}个月`"
                :value="unit"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="vertical-align:top">
          <el-button @click="calculate" type="primary">开始推演</el-button>
        </el-form-item>
      </el-form>
    </div>

      <div class="dictation-section" v-if="schedules.length>0">
        <el-table :data="schedules" style="width: 100%; margin: 0 20px 20px 20px" highlight-current-row >
          <el-table-column type="index" width="80" label="顺序" />
          <el-table-column prop="dateStr" label="日期" width="180" />
          <el-table-column prop="name" label="星期" width="180" >
            <template #default="scope">
                <span>{{ scope.row.lunar.ncWeek }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="农历" width="180" >
            <template #default="scope">
              <span>{{ scope.row.lunar.monthStr }} {{ scope.row.lunar.dayStr }}</span>
            </template>
          </el-table-column>
        </el-table>

        <el-row gutter=20 style="padding: 0 20px">
          <el-col :span="8" v-for="(item, index) in calendars" :key="index" style="margin-bottom: 20px">
            <el-calendar :model-value="item">
              <template #date-cell="{ data }">
                <el-badge value="值班" class="item" v-if="onScheduled(data.day)">
                  <div :class="getClassName(data.day)">
                    <div> {{ data.date.getDate() }}</div>
                    <div class="second-line"> {{renderSecondLine(data)}}</div>
                  </div>
                </el-badge>
                <div :class="getClassName(data.day)" v-else>
                  <div> {{ data.date.getDate() }}</div>
                  <div class="second-line"> {{renderSecondLine(data)}}</div>
                </div>
                <el-tag v-if="isCompDay(data.day)" type="warning" size="small" class="attention-class">班</el-tag>
                <el-tag v-if="isHoliday(data.day)" type="danger" size="small" class="attention-class">休</el-tag>
              </template>
            </el-calendar>
          </el-col>
<!--          <el-col :span="8"  v-if="schedules.length>1">-->
<!--            <el-calendar  v-model="schedules[1].date">-->
<!--              <template #date-cell="{ data }">-->
<!--                <el-badge value="值班" class="item" v-if="onScheduled(data.day)">-->
<!--                  <div :class="getClassName(data.day)">-->
<!--                    <div> {{ data.date.getDate() }}</div>-->
<!--                    <div class="second-line"> {{renderSecondLine(data)}}</div>-->
<!--                  </div>-->
<!--                </el-badge>-->
<!--                <div :class="getClassName(data.day)" v-else>-->
<!--                  <div> {{ data.date.getDate() }}</div>-->
<!--                  <div class="second-line"> {{renderSecondLine(data)}}</div>-->
<!--                </div>-->
<!--                <el-tag v-if="isCompDay(data.day)" type="warning" size="small" class="attention-class">班</el-tag>-->
<!--                <el-tag v-if="isHoliday(data.day)" type="danger" size="small" class="attention-class">休</el-tag>-->
<!--              </template>-->
<!--            </el-calendar>-->
<!--          </el-col>-->
<!--          <el-col :span="8" v-if="schedules.length>2">-->
<!--            <el-calendar  v-model="schedules[2].date">-->
<!--              <template #date-cell="{ data }">-->
<!--                <el-badge value="值班" class="item" v-if="onScheduled(data.day)">-->
<!--                  <div :class="getClassName(data.day)">-->
<!--                    <div> {{ data.date.getDate() }}</div>-->
<!--                    <div class="second-line"> {{renderSecondLine(data)}}</div>-->
<!--                  </div>-->
<!--                </el-badge>-->
<!--                <div :class="getClassName(data.day)" v-else>-->
<!--                  <div> {{ data.date.getDate() }}</div>-->
<!--                  <div class="second-line"> {{renderSecondLine(data)}}</div>-->
<!--                </div>-->
<!--                <el-tag v-if="isCompDay(data.day)" type="warning" size="small" class="attention-class">班</el-tag>-->
<!--                <el-tag v-if="isHoliday(data.day)" type="danger" size="small" class="attention-class">休</el-tag>-->
<!--              </template>-->
<!--            </el-calendar>-->
<!--          </el-col>-->
        </el-row>

      </div>
    </div>

</template>

<style scoped>

.search-box {
  margin-right: 20px;
}
.search-section{
  display: flex;
  margin: 20px 20px 0 20px;
  align-items: center;
}
.scheduled {
  color: orangered;
}

.dictation-section{
  display: flex;
  flex-wrap: wrap;
}
.terms-class{
  font-size: 13px;
  color: #666;
  position: relative;
  top: -15px;
}
.calendar-day {
  display: flex;
  flex-direction: column;
  align-items: center;

}
:deep(.el-calendar-table .el-calendar-day) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.second-line {
  font-size: 12px;

}
:deep(.el-badge__content) {
  top: -10px;
}
.attention-class {
  position: relative;
  z-index: 1;
  bottom: -10px;

}

</style>
