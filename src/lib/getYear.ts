import dayjs from 'dayjs';
export function getYearsSince(date: Date): number {
    //Using dayjs to get the difference in years
    return dayjs().diff(date, 'year');
}