import moment from "moment";

export interface MyMoment {
  formatWithLocale(
    date: Date | string,
    format: string,
    locale?: string
  ): string;
}

const MomentUtil: MyMoment = {
  ...moment,
  formatWithLocale: function (
    date: Date | string,
    format: string,
    locale?: string
  ): string {
    const m = moment(date);
    if (locale) {
      m.locale(locale);
    }
    return m.format(format);
  },
};

export default MomentUtil;
