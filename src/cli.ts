#!/usr/bin/env node
import {translate} from './main'
const { Command } = require('commander');

const program = new Command();
program.version('0.0.1')                  // 版本
       .name('hi-fanyi')                 // 名称
       .usage('<English/Chinese>')        // 使用说明
       .arguments('<English>')            // 参数
       .action((word:string) => {                 // 处理
         translate(word)
       })








program.parse(process.argv)
