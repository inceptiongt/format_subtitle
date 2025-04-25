// 加载 sub.json 文件

/**
 * simple:
 * {
    "tStartMs": 11760,
    "dDurationMs": 6640,
    "segs": [ {
      "utf8": "亚洲曾是古代帝国和传奇统治者的土地\n，但"
    }]
 */
export interface subtitle_item {
  tStartMs: number;
  dDurationMs: number;
  segs: {
    utf8: string;
  }[];
}

export interface resultItem {
  tStartMs: number;
  tEndMs: number;
  char: string
}


/**
 * 根据字幕的文字内容，按照"完整句子"，重新整理字幕内容
 * @example
 * input:
 * 
 * [ {
    "tStartMs": 11760,
    "dDurationMs": 6640,
    "segs": [ {
      "utf8": "亚洲曾是古代帝国和传奇统治者的土地\n，但"
    } ]
  }, {
    "tStartMs": 18400,
    "dDurationMs": 6960,
    "segs": [ {
      "utf8": "在近代早期沦为不断扩张的欧洲列强的殖民地\n。 受亚洲丝绸和香料贸易的吸引，"
    } ]
  }, {
    "tStartMs": 25360,
    "dDurationMs": 4960,
    "segs": [ {
      "utf8": "他们的殖民努力最初是\n为了利用亚洲大陆的经济"
    } ]
  }, {
    "tStartMs": 30320,
    "dDurationMs": 6160,
    "segs": [ {
      "utf8": "实力。 最终，欧洲国家开始\n使用越来越多的武力，到"
    } ]
  }, {
    "tStartMs": 36480,
    "dDurationMs": 6000,
    "segs": [ {
      "utf8": "20 世纪初，东方世界\n几乎完全掌握在殖民帝国的手中。"
    } ]
  }
  
  output:
    [ {
    "tStartMs": 11760,
    "dDurationMs": ,
    "segs": [ {
      "utf8": "亚洲曾是古代帝国和传奇统治者的土地\n，但在近代早期沦为不断扩张的欧洲列强的殖民地\n。"
    } ]
  }, {
    "tStartMs": ,
    "dDurationMs": ,
    "segs": [ {
      "utf8": "受亚洲丝绸和香料贸易的吸引，他们的殖民努力最初是\n为了利用亚洲大陆的经济实力。"
    } ]
  }, {
    "tStartMs": ,
    "dDurationMs": ,
    "segs": [ {
      "utf8": " 最终，欧洲国家开始\n使用越来越多的武力，到20 世纪初，东方世界\n几乎完全掌握在殖民帝国的手中。"
    } ]
  }
  ]

  input中 segs 的字符是一句完整的话的一部分，而 output 中 segs 的字符都是完整的一句话
  output 中 tStartMs、dDurationMs需要根据 segs 的内容长度重新计算
 *  
 * 
  */

export const SenEnd = ['；','。','？','！']

const SenEdge = [...SenEnd,'，']

export const format_subtitle = (subtitle: subtitle_item[]) => {
  // 逗号也作为句子边界，为了将太长的句子分割
  
  // 详见 readme》优化》一
  let isEndWithSenEdge = false

  // Helper function to clean text (remove newlines and excess whitespace)
  const cleanText = (text: string): string => {
    return text
      .replace(/\n/g, '')  // Remove newlines
      .replace(/\s+/g, '') // Remove all whitespace
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
      .trim();
  };

  const deleteComma = (text: string): string => {
    return text.endsWith('，') ? text.slice(0, -1) : text;
  }

  const result: resultItem[] = []

  let resultItem:resultItem = {
    tStartMs: subtitle[0].tStartMs,
    tEndMs: 0,
    char: ''
  }


  for (const item of subtitle) {
    const {tStartMs,dDurationMs} = item
    const iChar = cleanText(item.segs[0].utf8)

    // 如果字幕为空，则跳过
    if(iChar === ''){
      // 更新下一个 item 的时间
      // resultItem.tStartMs = tStartMs + dDurationMs
      resultItem.tStartMs = tStartMs
      continue
    }

    if(isEndWithSenEdge) {
      resultItem.tStartMs = tStartMs
    }

    //正则： 非 SenEdge 字符，零个或多个， SenEdge 字符
    const reg = new RegExp(`[^${SenEdge.join('')}]*[${SenEdge.join('')}]`,'g')
    let senEdgePart = reg.exec(iChar)    
    
    if (!senEdgePart){
      resultItem.char += iChar
      continue
    } else {
      while(senEdgePart) {
        const {lastIndex} = reg
        resultItem.char += senEdgePart[0]
        
        // 字符长度大于 10 或 以句号结尾
        if(resultItem.char.length > 10 || SenEnd.includes(senEdgePart[0].slice(-1))) {
          const edgeTime = tStartMs+Math.round(dDurationMs*(lastIndex/iChar.length))
          resultItem.tEndMs = edgeTime
          
          result.push({...resultItem, char: deleteComma(resultItem.char)})
          
          // 下一个 item 的开始时间是上一个 item 的结束时间
          resultItem = {
            tEndMs: 0,
            tStartMs: edgeTime,
            char: ''
          }

          // 如果 iChar 是已 SenEdge 结尾
          if(lastIndex === iChar.length) {
            isEndWithSenEdge = true
            // reg 已经匹配到字符末尾，直接跳出 while 循环。
            break
          }
          
          // 继续匹配
          senEdgePart = reg.exec(iChar)
          if(!senEdgePart) {
            resultItem.char = iChar.slice(lastIndex)
            isEndWithSenEdge = false
          }
        } else {
          // 继续匹配
          senEdgePart = reg.exec(iChar)
          if(!senEdgePart) {
            resultItem.char += iChar.slice(lastIndex)
            isEndWithSenEdge = false
          }
        }
        
      }

    }

    
  }
  
  
  return result;
}

// const result = format_subtitle(sub1);
// const srtContent = subArr2Srt(result);
// fs.writeFileSync('./output1.srt', srtContent);