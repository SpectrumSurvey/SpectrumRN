/*
 * @Author: middle
 * @Desc: text.util
 * @Date: 2020/2/7 15:23
 * @Email: middle2021@gmail.com
 */

const  content = 'test';

export default '<html lang="zh">\n' +
'    <head>\n' +
'        <meta charset="utf-8">\n' +
'        <meta content=\'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0\' name=\'viewport\' />\n' +
'    </head>\n' +
'    <body>' + content +
'    </body>' +
'</html>';


const content2 = 'test' +
  '​\n';

export const permissionHtml = '<html lang="zh">\n' +
'    <head>\n' +
'        <meta charset="utf-8">\n' +
'        <meta content=\'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0\' name=\'viewport\' />\n' +
'    </head>\n' +
'    <body>' + content2 +
'    </body>' +
'</html>';

