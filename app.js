var http = require('http');
var fs = require('fs');


var options = {
  host: 'www.niceoppai.net',
  path: '/onepiece/800/',
  port: 80,
  method: 'GET',
  headers: {
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language':'th-TH,th;q=0.8,en-US;q=0.6,en;q=0.4,ja;q=0.2',
    'Cache-Control':'max-age=0',
    'Connection':'keep-alive',
    'Host':'www.niceoppai.net',
    'If-Modified-Since':'Fri, 25 Mar 2016 05:03:04 GMT',
    'Upgrade-Insecure-Requests':'1',
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36'
  }
}
var request = http.request(options, function (res) {
  var data = '';
  res.on('data', function (chunk) {
    data += chunk;
  });
  res.on('end', function () {

    fs.appendFile('./chunk/onepiece-800.txt', data, (err) => {

    });

    var getList = new RegExp('<option value="(http://www.niceoppai.net/.*?)" >(.*?)<\/option>', 'ig');
    data.match(getList).forEach(function(option){
      var manga = getList.exec(option);
      if(manga) console.log(manga[1], manga[2]); else cosnole.log(option);
    });
    // fs.readFile('./chunk/onepiece-800.txt', (err, data) => {
    //   if (err) throw err;
    //   console.log(data);
    // });
  });
});
request.on('error', function (e) {
    console.log(e.message);
});
request.end();