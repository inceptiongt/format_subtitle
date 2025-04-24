/**
json = [{
    "tStartMs": 340,
    "dDurationMs": 3180,
    "segs": [ {
      "utf8": "我们从 19 世纪中叶开始，"
    } ]
  }, {
    "tStartMs": 3520,
    "dDurationMs": 4380,
    "segs": [ {
      "utf8": "在欧洲，民族主义的兴起削弱了\n主导力量。"
    } ]
  }, {
    "tStartMs": 7900,
    "dDurationMs": 7220,
    "segs": [ {
      "utf8": "与法国结盟的撒丁王国击败了奥地利帝国，实现了意大利的统一。"
    } ]
}]

TXT：
我们从 19 世纪中叶开始，在欧洲，民族主义的兴起削弱了主导力量。
与法国结盟的撒丁王国击败了奥地利帝国，实现了意大利的统一。

提取每一个utf8字段中的内容，每一个内容占一行。
再进行合并，使得一句话占一行
 * 
 * 
 * 
 * 
*/

import { subtitle_item } from "./index";
import { SenEnd } from "./formatSub";

export const subArr2Txt = (json: subtitle_item[]): string => {
  // Extract all utf8 content and clean up newlines
  const text = json.map(item => item.segs[0].utf8.replace(/\n/g, '')).join('');
  
  // Create regex pattern from SenEnd punctuation marks
  const pattern = new RegExp(`([${SenEnd.join('')}])\\s*`, 'g');
  
  // Split text into sentences and add newlines after each sentence
  return text.replace(pattern, '$1\n').trim();
}