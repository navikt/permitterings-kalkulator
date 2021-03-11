import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export const configureDayJS = () => {
    dayjs.extend(isSameOrAfter);
    dayjs.extend(isBetween);
    dayjs.extend(customParseFormat);
};
