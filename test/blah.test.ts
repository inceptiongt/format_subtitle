import { format_subtitle } from '../src';
import { subArr2Srt } from '../src/subArr2Srt'
import fs from 'fs'

const sub1 = [ {
  "tStartMs": 11680,
  "dDurationMs": 4480,
  "segs": [ {
    "utf8": "到目前为止，我们在这个系列中主要\n讲述了"
  } ]
}, {
  "tStartMs": 16160,
  "dDurationMs": 5520,
  "segs": [ {
    "utf8": "太平洋战争开始之前的日本帝国的历史，但\n战争的另一个主要参与者又如何呢？    第一次世界大战结束后"
  } ]
}, {
  "tStartMs": 21680,
  "dDurationMs": 5040,
  "segs": [ {
    "utf8": "美国的立场是什么\n？"
  } ]
}, {
  "tStartMs": 26720,
  "dDurationMs": 5680,
  "segs": [ {
    "utf8": "他们在太平洋的利益dddsfdfds，他们在太平洋的利益1232312312，和战略是什么？\n他们对未来的竞争对手"
  } ]
}, {
  "tStartMs": 32400,
  "dDurationMs": 5040,
  "segs": [ {
    "utf8": "及其崛起成为大国有何感想？ 今天，我们\n将在"
  } ]
}]


describe('blah', () => {
  it('works', () => {
    const result = format_subtitle(sub1);
    const srtContent = subArr2Srt(result);
    fs.writeFileSync('./output1.srt', srtContent);
  });
});
