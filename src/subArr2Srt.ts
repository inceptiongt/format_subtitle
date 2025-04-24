import type { resultItem } from "./index";

/**
 * 把 subtitle_item[] 类型的数据转换成 srt 格式的字幕内容
 * srt 格式如下：
 * 
 *  1
    00:05:00,400 --> 00:05:15,300
    This is an example of a.

    2
    00:05:16,400 --> 00:05:25,300
    This is an example of a subtitle - 2nd subtitle.
 * 
*/

export const subArr2Srt = (subArr: resultItem[]): string => {
    // 如果数组为空，返回空字符串
    if (subArr.length === 0) {
        return '';
    }

    // 将毫秒转换为 srt 时间格式 (00:05:00,400)
    const msToSrtTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = ms % 1000;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
    };

    // 生成 srt 格式的字幕内容
    return subArr.map((item, index) => {
        // 计算开始和结束时间
        const startTime = msToSrtTime(item.tStartMs);
        const endTime = msToSrtTime(item.tEndMs);
        
        // 获取字幕文本（合并所有 segs 中的 utf8 文本）
        const text = item.char
        // 返回 srt 格式的字幕块
        return `${index + 1}\n${startTime} --> ${endTime}\n${text}\n`;
    }).join('\n');
};