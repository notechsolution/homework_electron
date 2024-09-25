const defaultHolidays = {
  Name: '中国节假日补班日历',
  Version: '1.0',
  Generated: '20240103T182037Z',
  Timezone: 'Asia/Shanghai',
  Author: 'ShuYZ.com',
  URL: 'https://github.com/lanceliao/china-holiday-calender',
  Years: {
    2024: [
      {
        Name: '元旦',
        StartDate: '2024-01-01',
        EndDate: '2024-01-01',
        Duration: 1,
        CompDays: [],
        URL: 'https://www.gov.cn/zhengce/content/202310/content_6911527.htm',
        Memo: '一、元旦：1月1日放假，与周末连休。'
      },
      {
        Name: '春节',
        StartDate: '2024-02-10',
        EndDate: '2024-02-17',
        Duration: 8,
        CompDays: [
          '2024-02-04',
          '2024-02-18'
        ],
        URL: 'https://www.gov.cn/zhengce/content/202310/content_6911527.htm',
        Memo: '二、春节：2月10日至17日放假调休，共8天。2月4日（星期日）、2月18日（星期日）上班。鼓励各单位结合带薪年休假等制度落实，安排职工在除夕（2月9日）休息。'
      },
      {
        Name: '清明节',
        StartDate: '2024-04-04',
        EndDate: '2024-04-06',
        Duration: 3,
        CompDays: [
          '2024-04-07'
        ],
        URL: 'https://www.gov.cn/zhengce/content/202310/content_6911527.htm',
        Memo: '三、清明节：4月4日至6日放假调休，共3天。4月7日（星期日）上班。'
      },
      {
        Name: '劳动节',
        StartDate: '2024-05-01',
        EndDate: '2024-05-05',
        Duration: 5,
        CompDays: [
          '2024-04-28',
          '2024-05-11'
        ],
        URL: 'https://www.gov.cn/zhengce/content/202310/content_6911527.htm',
        Memo: '四、劳动节：5月1日至5日放假调休，共5天。4月28日（星期日）、5月11日（星期六）上班。'
      },
      {
        Name: '端午节',
        StartDate: '2024-06-10',
        EndDate: '2024-06-10',
        Duration: 1,
        CompDays: [],
        URL: 'https://www.gov.cn/zhengce/content/202310/content_6911527.htm',
        Memo: '五、端午节：6月10日放假，与周末连休。'
      },
      {
        Name: '中秋节',
        StartDate: '2024-09-15',
        EndDate: '2024-09-17',
        Duration: 3,
        CompDays: [
          '2024-09-14'
        ],
        URL: 'https://www.gov.cn/zhengce/content/202310/content_6911527.htm',
        Memo: '六、中秋节：9月15日至17日放假调休，共3天。9月14日（星期六）上班。'
      },
      {
        Name: '国庆节',
        StartDate: '2024-10-01',
        EndDate: '2024-10-07',
        Duration: 7,
        CompDays: [
          '2024-09-29',
          '2024-10-12'
        ],
        URL: 'https://www.gov.cn/zhengce/content/202310/content_6911527.htm',
        Memo: '七、国庆节：10月1日至7日放假调休，共7天。9月29日（星期日）、10月12日（星期六）上班。'
      }
    ],
    2023: [
      {
        Name: '元旦',
        StartDate: '2022-12-31',
        EndDate: '2023-01-02',
        Duration: 3,
        CompDays: [],
        URL: 'http://www.gov.cn/gongbao/content/2023/content_5736714.htm',
        Memo: '一、元旦：2022年12月31日至2023年1月2日放假调休，共3天。'
      },
      {
        Name: '春节',
        StartDate: '2023-01-21',
        EndDate: '2023-01-27',
        Duration: 7,
        CompDays: [
          '2023-01-28',
          '2023-01-29'
        ],
        URL: 'http://www.gov.cn/gongbao/content/2023/content_5736714.htm',
        Memo: '二、春节：1月21日至27日放假调休，共7天。1月28日（星期六）、1月29日（星期日）上班。'
      },
      {
        Name: '清明节',
        StartDate: '2023-04-05',
        EndDate: '2023-04-05',
        Duration: 1,
        CompDays: [],
        URL: 'http://www.gov.cn/gongbao/content/2023/content_5736714.htm',
        Memo: '三、清明节：4月5日放假，共1天。'
      },
      {
        Name: '劳动节',
        StartDate: '2023-04-29',
        EndDate: '2023-05-03',
        Duration: 5,
        CompDays: [
          '2023-04-23',
          '2023-05-06'
        ],
        URL: 'http://www.gov.cn/gongbao/content/2023/content_5736714.htm',
        Memo: '四、劳动节：4月29日至5月3日放假调休，共5天。4月23日（星期日）、5月6日（星期六）上班。'
      },
      {
        Name: '端午节',
        StartDate: '2023-06-22',
        EndDate: '2023-06-24',
        Duration: 3,
        CompDays: [
          '2023-06-25'
        ],
        URL: 'http://www.gov.cn/gongbao/content/2023/content_5736714.htm',
        Memo: '五、端午节：6月22日至24日放假调休，共3天。6月25日（星期日）上班。'
      },
      {
        Name: '中秋节、国庆节',
        StartDate: '2023-09-29',
        EndDate: '2023-10-06',
        Duration: 8,
        CompDays: [
          '2023-10-07',
          '2023-10-08'
        ],
        URL: 'http://www.gov.cn/gongbao/content/2023/content_5736714.htm',
        Memo: '六、中秋节、国庆节：9月29日至10月6日放假调休，共8天。10月7日（星期六）、10月8日（星期日）上班。'
      }
    ],
    2022: [
      {
        Name: '元旦',
        StartDate: '2022-01-01',
        EndDate: '2022-01-03',
        Duration: 3,
        CompDays: [],
        URL: 'https://www.gov.cn/gongbao/content/2021/content_5651728.htm',
        Memo: '一、元旦：2022年1月1日至3日放假，共3天。'
      },
      {
        Name: '春节',
        StartDate: '2022-01-31',
        EndDate: '2022-02-06',
        Duration: 7,
        CompDays: [
          '2022-01-29',
          '2022-01-30'
        ],
        URL: 'https://www.gov.cn/gongbao/content/2021/content_5651728.htm',
        Memo: '二、春节：1月31日至2月6日放假调休，共7天。1月29日（星期六）、1月30日（星期日）上班。'
      },
      {
        Name: '清明节',
        StartDate: '2022-04-03',
        EndDate: '2022-04-05',
        Duration: 3,
        CompDays: [
          '2022-04-02'
        ],
        URL: 'https://www.gov.cn/gongbao/content/2021/content_5651728.htm',
        Memo: '三、清明节：4月3日至5日放假调休，共3天。4月2日（星期六）上班。'
      },
      {
        Name: '劳动节',
        StartDate: '2022-04-30',
        EndDate: '2022-05-04',
        Duration: 5,
        CompDays: [
          '2022-04-24',
          '2022-05-07'
        ],
        URL: 'https://www.gov.cn/gongbao/content/2021/content_5651728.htm',
        Memo: '四、劳动节：4月30日至5月4日放假调休，共5天。4月24日（星期日）、5月7日（星期六）上班。'
      },
      {
        Name: '端午节',
        StartDate: '2022-06-03',
        EndDate: '2022-06-05',
        Duration: 3,
        CompDays: [],
        URL: 'https://www.gov.cn/gongbao/content/2021/content_5651728.htm',
        Memo: '五、端午节：6月3日至5日放假，共3天。'
      },
      {
        Name: '中秋节',
        StartDate: '2022-09-10',
        EndDate: '2022-09-12',
        Duration: 3,
        CompDays: [],
        URL: 'https://www.gov.cn/gongbao/content/2021/content_5651728.htm',
        Memo: '六、中秋节：9月10日至12日放假，共3天。'
      },
      {
        Name: '国庆节',
        StartDate: '2022-10-01',
        EndDate: '2022-10-07',
        Duration: 7,
        CompDays: [
          '2022-10-08',
          '2022-10-09'
        ],
        URL: 'https://www.gov.cn/gongbao/content/2021/content_5651728.htm',
        Memo: '七、国庆节：10月1日至7日放假调休，共7天。10月8日（星期六）、10月9日（星期日）上班。'
      }
    ]
  }
}

export default defaultHolidays
