
import * as querystring from 'querystring';
import * as https from 'https';
import { IncomingMessage } from 'http';
import md5 from 'md5';

import { config } from './config';

export const translate = (word: string) => {
  const appId = config.appId;
  const appSecret = config.appSecret;
  const q = word;
  const salt = Math.random();
  const sign = md5(appId + q + salt + appSecret);
  const en2ch = /[a-zA-Z]/.test(word);
  const query: string = querystring.stringify({
    q,
    from: en2ch ? 'en' :'zh',
    to: en2ch ? 'zh' :'en',
    appid: appId,
    salt,
    sign
  });
  const options = {
    hostname: "fanyi-api.baidu.com",
    port: 443,
    path: `/api/trans/vip/translate?${query}`,
    method: "GET",
  };
  const req = https.request(options, (res: IncomingMessage) => {
    let chunks: Buffer[] = [];
    res.on("data", (chunk) => {
      chunks.push(chunk);
    });
    res.on('end', () => {
      const str = Buffer.concat(chunks).toString();

      type translateResult = {
        from: string;
        to: string;
        trans_result: {
          src: string,
          dst: string
        }[];
        error_code?: string;
        error_msg ?:string;
      }
      const result:translateResult = JSON.parse(str);
      if(result.error_code){
        console.error(result.error_msg);
        process.exit(2);
      }else{
        result.trans_result.map((item:{src:string,dst:string}) => {
          console.log(item.dst);
        })
        process.exit(0);
      }
    })
  });

  req.on("error", (e) => {
    console.error(e);
  });
  req.end();
};
