import _ from 'lodash';
import moment from 'moment';
import { createAxiosService } from '/@/utils/request';
import defaultHolidays from './backup';

const getChineseHoliday = async () => {
  // get chinese holiday json file by this http url https://raw.githubusercontent.com/lanceliao/china-holiday-calender/master/holidayAPI.json
  const requestService = createAxiosService('https://www.shuyz.com');
  let holidayData = defaultHolidays;
  try {
    const response = await requestService.get('/githubfiles/china-holiday-calender/master/holidayAPI.json');
    // if response status is 200 and response data is not null
    if (response.status === 200 && response.data) {
      holidayData = response.data;
    }
  } catch (error) {
    console.log('fetch holidays error:', error);
  }
  // flat array  _.values(response.data['Years']) to get all holiday items
  const items = _.flatten(_.values(holidayData.Years));

  const holidays: { name: string; memo: string; duration: number; days: string[]; compDays: any }[] = [];
  items.forEach(item => {
    const holiday = {
      name: item.Name,
      memo: item.Memo,
      duration: item.Duration,
      days: [] as string[],
      compDays: item.CompDays
    };
    // calculate and add startDate to duration days into days
    for (let i = 0; i < item.Duration; i++) {
      const day = moment(item.StartDate).add(i, 'day').format('YYYY-MM-DD');
      holiday.days.push(day);
    }
    holidays.push(holiday);
  });
  console.log('holidays:', holidays);
  return holidays;
};

export {
  getChineseHoliday
};
