<template>
	<div class="home-container">
		<el-row :gutter="15" class="home-card-two mb15">
			<el-col :xs="24" :sm="14" :md="14" :lg="16" :xl="16">
				<div class="home-card-item">
          <el-image :src="guideImage" fit="cover" style="border-radius: 4px;"></el-image>
				</div>
			</el-col>
			<el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8" class="home-media">
				<div class="home-card-item">
          <el-calendar v-model="today">
            <template #date-cell="{ data }">
              <div class="calendar-day">
                <div> {{ data.date.getDate() }}</div>
                <div class="second-line"> {{renderSecondLine(data)}}</div>
              </div>
              <el-tag v-if="isCompDay(data.day)" type="warning" size="small" class="attention-class">班</el-tag>
              <el-tag v-if="isHoliday(data.day)" type="danger" size="small" class="attention-class">休</el-tag>
            </template>
          </el-calendar>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent, onMounted, ref, watch, nextTick, onActivated } from 'vue';
import { useStore } from '/@/store/index';
import moment from 'moment/moment';
import { solarToLunar } from 'vue-solar-lunar';
import _ from 'lodash';
import { getChineseHoliday } from '/@/service/holiday';
import guideImage from '/@/assets/home-1.jpg';

let global: any = {
	dispose: [null, '', undefined],
};

export default defineComponent({
	name: 'home',
	setup() {
		const store = useStore();
		const state = reactive({
      calendars: [] as any,
      holidays:[] as any,
      today: new Date(),

		});

    const getLunar = function (date:any){
      const solar = moment(date);
      return solarToLunar(solar.year(), solar.month() + 1, solar.date());
    }

    const renderSecondLine = function (data) {
      if (!_.isEmpty(state.holidays)) {
        // if any holiday's days include date
        const holiday = state.holidays.find(item => item.days.includes(data.day));
        if (holiday) {
          return `${holiday.name}`;
        }
      }
      const lunar = getLunar(data.date);
      if (lunar.Terms) {
        return `${lunar.Terms}`;
      }
      if (data.date.getDate() === 1) {
        return `${lunar.monthStr}`;
      }
      return `${lunar.dayStr}`;
    }

    const isCompDay = function (day) {
      const holiday = state.holidays.find(holiday => holiday.compDays.includes(day));
      if (holiday) {
        return true;
      }
      return false;
    }

    const isHoliday = function (day) {
      const holiday = state.holidays.find(holiday => holiday.days.includes(day));
      if (holiday) {
        return true;
      }
      return false;
    }
		// 页面加载时
		onMounted(() => {
      getChineseHoliday().then(res => {
        state.holidays = res;
        console.log(state.holidays);
      })
		});
		// 由于页面缓存原因，keep-alive
		onActivated(() => {
		});
		// 监听 vuex 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
		watch(
			() => store.state.tagsViewRoutes.isTagsViewCurrenFull,
			() => {
			}
		);
		// 监听 vuex 中是否开启深色主题
		watch(
			() => store.state.themeConfig.themeConfig.isIsDark,
			(isIsDark) => {
				nextTick(() => {
				});
			},
			{
				deep: true,
				immediate: true,
			}
		);
		return {
			...toRefs(state),
      renderSecondLine,
      isCompDay,
      isHoliday,
      guideImage
		};
	},
});
</script>

<style scoped lang="scss">
$homeNavLengh: 8;
.home-container {
	overflow: hidden;
	.home-card-one,
	.home-card-two,
	.home-card-three {
		.home-card-item {
			width: 100%;
			height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);
			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}
			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;
				i {
					color: var(--el-text-color-placeholder);
				}
			}
			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
		}
	}
	.home-card-one {
		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/10) + s;
			}
		}
	}
	.home-card-two,
	.home-card-three {
		.home-card-item {
			height: 600px;
			width: 100%;
			overflow: hidden;
		}
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
}
</style>
