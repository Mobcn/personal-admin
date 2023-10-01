/**
 * 时间工具
 */
const dateUtils = {
    /**
     * 时间格式化
     *
     * @param time 时间戳
     * @param  format 时间格式，默认yyyy-MM-dd HH:mm:ss
     * @param  offset 时区偏移，默认+8（北京时间）
     * @returns  时间格式化字符串
     */
    formatDate: (time: number | string, format = 'yyyy-MM-dd HH:mm:ss', offset = 8) => {
        const date = new Date(Number(time) + offset * 60 * 60 * 1000);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours();
        const min = date.getUTCMinutes();
        const sec = date.getUTCSeconds();
        const preArr = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        return format
            .replace(/yyyy/g, String(year))
            .replace(/MM/g, preArr[month] ?? month)
            .replace(/dd/g, preArr[day] ?? day)
            .replace(/HH/g, preArr[hour] ?? hour)
            .replace(/mm/g, preArr[min] ?? min)
            .replace(/ss/g, preArr[sec] ?? sec);
    },

    /**
     * 解析时间字符串为时间戳字符串
     *
     * @param dateStr 时间字符串，格式：yyyy-MM-dd HH:mm:ss
     * @param  offset 时区偏移，默认+8（北京时间）
     * @returns
     */
    parse2Time: (dateStr: string, offset = 8) => {
        const offsetDirection = offset < 0 ? '-' : '+';
        offset = Math.abs(offset);
        const offsetStr = offsetDirection + (offset < 10 ? '0' + offset : offset);
        const parseStr = `${dateStr}.000${offsetStr}:00`.replace(' ', 'T');
        return String(Date.parse(parseStr));
    }
};

export default dateUtils;
export const formatDate = dateUtils.formatDate;
export const parse2Time = dateUtils.parse2Time;
