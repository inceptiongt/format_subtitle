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

chapters = [
    {
        "chapterRenderer": {
            "title": {
                "simpleText": "Rise of nationalism in Europe"
            },
            "timeRangeStartMillis": 0,
            "onActiveCommand": {
                "clickTrackingParams": "CMYBEMaHBiITCJPXk7Gy8IwDFfPCcgkdiuoUyQ==",
                "setActivePanelItemAction": {
                    "panelTargetId": "engagement-panel-macro-markers-description-chapters",
                    "itemIndex": 0
                }
            },
            "thumbnail": {
                "thumbnails": [
                    {
                        "url": "https://i.ytimg.com/vi/QwsVJb-ckqM/hqdefault_0.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=\u0026rs=AOn4CLBzIDy4GjNK18ZEPHTopT6c8v-_qg",
                        "width": 168,
                        "height": 94
                    },
                    {
                        "url": "https://i.ytimg.com/vi/QwsVJb-ckqM/hqdefault_0.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB\u0026rs=AOn4CLD-j-R5nTc_IYdMtqPdU6oVytVkyw",
                        "width": 336,
                        "height": 188
                    }
                ]
            }
        }
    },
    {
        "chapterRenderer": {
            "title": {
                "simpleText": "Triple Entente"
            },
            "timeRangeStartMillis": 89000,
            "onActiveCommand": {
                "clickTrackingParams": "CMYBEMaHBiITCJPXk7Gy8IwDFfPCcgkdiuoUyQ==",
                "setActivePanelItemAction": {
                    "panelTargetId": "engagement-panel-macro-markers-description-chapters",
                    "itemIndex": 1
                }
            },
            "thumbnail": {
                "thumbnails": [
                    {
                        "url": "https://i.ytimg.com/vi/QwsVJb-ckqM/hqdefault_96966.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=\u0026rs=AOn4CLC2sL5upIdG5_G9JknqHcHwom-LtA",
                        "width": 168,
                        "height": 94
                    },
                    {
                        "url": "https://i.ytimg.com/vi/QwsVJb-ckqM/hqdefault_96966.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB\u0026rs=AOn4CLCJu-x-n5F5277s7gbEx2GSsh6DuQ",
                        "width": 336,
                        "height": 188
                    }
                ]
            }
        }
}}

json_english = [

]

markdown:

// chapter
Rise of nationalism in Europe
// chinese
我们从 19 世纪中叶开始，在欧洲，民族主义的兴起削弱了主导力量。
与法国结盟的撒丁王国击败了奥地利帝国，实现了意大利的统一。
// english
1914. The Great Powers of Europe are divided into two rival alliances:......


提取每一个utf8字段中的内容，每一个内容占一行。
再进行合并，使得一句话占一行
 * 
 * 
 * 
 * 
*/

import { subtitle_item } from "./index";
import { SenEnd } from "./formatSub";

/**
 * Interface for chapter information
 */
export interface chapter_item {
  chapterRenderer: {
    title: {
      simpleText: string;
    };
    timeRangeStartMillis: number;
  };
}

/**
 * Convert subtitle array to formatted text with chapter titles
 * @param json Subtitle items array
 * @param chapters Chapter items array (optional)
 * @param json_english English subtitle items array (optional)
 * @returns Formatted text with chapter titles in Markdown format
 */
export const subArr2Md = (json: subtitle_item[], chapters?: chapter_item[], json_english?: subtitle_item[]): string => {
  let currentChapterIndex = 0;
  let result = '';
  let currentChapterContent = '';
  let currentChapterEnglishContent = '';

  // Generate virtual chapters if no chapters provided
  if (!chapters) {
    const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds
    const lastTime = json[json.length - 1].tStartMs + json[json.length - 1].dDurationMs;
    const virtualChapters: chapter_item[] = [];
    
    for (let time = 0; time < lastTime; time += FIVE_MINUTES) {
      virtualChapters.push({
        chapterRenderer: {
          title: {
            simpleText: (virtualChapters.length + 1).toString()
          },
          timeRangeStartMillis: time
        }
      });
    }
    chapters = virtualChapters;
  }
  
  // English sentence endings (excluding decimal points and years)
  // 小数点不匹配，省略号整体匹配
  const englishPattern = /(?<!\d)([.!?]|\.\.\.)(?!\d)(?!\.)\s*/g;
  
  // Process each subtitle item
  json.forEach((item, index) => {
    const nextTime = item.tStartMs + item.dDurationMs;
    
    // Check if we need to start a new chapter
    while (chapters && currentChapterIndex < chapters.length && 
           chapters[currentChapterIndex].chapterRenderer.timeRangeStartMillis <= nextTime) {
      // If we have content from previous chapter, add it to result
      if (currentChapterContent) {
        // Process Chinese content
        const chinesePattern = new RegExp(`([${SenEnd.join('')}])\\s*`, 'g');
        result += currentChapterContent.replace(chinesePattern, '$1\n');
        
        // Process English content if exists
        if (currentChapterEnglishContent) {
          result += '\n\n' + currentChapterEnglishContent.replace(englishPattern, '$1\n');
        }
        result += '\n\n';
      }
      
      // Start new chapter
      const chapter = chapters[currentChapterIndex];
      result += `# ${chapter.chapterRenderer.title.simpleText}\n\n`;
      currentChapterIndex++;
      currentChapterContent = '';
      currentChapterEnglishContent = '';
    }

    // Add Chinese content
    currentChapterContent += item.segs[0].utf8.replace(/\n/g, '');
    
    // Add corresponding English content if available
    if (json_english && json_english[index]) {
      currentChapterEnglishContent += json_english[index].segs[0].utf8.replace(/\n/g, '');
    }
  });

  // Add the last chapter's content
  if (currentChapterContent) {
    // Process Chinese content
    const chinesePattern = new RegExp(`([${SenEnd.join('')}])\\s*`, 'g');
    result += currentChapterContent.replace(chinesePattern, '$1\n');
    
    // Process English content if exists
    if (currentChapterEnglishContent) {
      result += '\n\n' + currentChapterEnglishContent.replace(englishPattern, '$1\n');
    }
  }

  // Add any remaining chapter titles
  if (chapters) {
    while (currentChapterIndex < chapters.length) {
      const chapter = chapters[currentChapterIndex];
      result += `\n# ${chapter.chapterRenderer.title.simpleText}\n\n`;
      currentChapterIndex++;
    }
  }

  return result.trim();
}