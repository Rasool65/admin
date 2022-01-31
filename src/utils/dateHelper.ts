import moment from 'moment-jalaali';

export class DateHelper {
  public static jalaliToGregorian = (
    jy: number,
    jm: number,
    jd: number
  ): number[] => {
    let salA: any;
    let gy: any;
    let gm: any;
    let gd: any;
    let days: any;

    jy += 1595;
    days =
      -355668 +
      365 * jy +
      parseInt((jy / 33).toString(), 10) * 8 +
      parseInt((((jy % 33) + 3) / 4).toString(), 10) +
      jd +
      (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
    gy = 400 * parseInt((days / 146097).toString(), 10);
    days %= 146097;
    if (days > 36524) {
      gy += 100 * parseInt((--days / 36524).toString(), 10);
      days %= 36524;
      if (days >= 365) days++;
    }
    gy += 4 * parseInt((days / 1461).toString(), 10);
    days %= 1461;
    if (days > 365) {
      gy += parseInt(((days - 1) / 365).toString(), 10);
      days = (days - 1) % 365;
    }
    gd = days + 1;
    salA = [
      0,
      31,
      (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    for (gm = 0; gm < 13 && gd > salA[gm]; gm++) gd -= salA[gm];
    return [gy, gm, gd];
  };

  public static persianToIsoDate = (persianDate: any) => {
    if (persianDate) {
      const [year, month, day] = persianDate.split('/');
      const dateResult = DateHelper.jalaliToGregorian(
        Number(year),
        Number(month),
        Number(day) + 1
      );
      const date = new Date(
        `${dateResult[0]}/${dateResult[1]}/${dateResult[2]}`
      ).toJSON();

      return date;
    }

    return '';
  };

  public static isoDateTopersian = (isoDate: any) => {
    moment.locale('fa');

    const date = moment(isoDate).format('jYYYY/jMM/jDD');

    return date;
  };

  public static isoDateToPersianDateTime = (isoDate: any) => {
    moment.locale('fa');

    const date = moment(isoDate).format('jYYYY/jMM/jDD HH:mm');

    return date;
  };

  public static splitTime = (date: string) => {
    let modifyTime: string = '';

    if (!!date) {
      const timeSplit = date.slice(11).split(':');

      modifyTime = `${timeSplit[0]}:${timeSplit[1]}`;
    }

    return modifyTime;
  };
}
