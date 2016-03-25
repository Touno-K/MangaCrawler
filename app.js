var http = require('http');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Q = require('q')

var options = function(pathname){
  return {
    host: 'www.niceoppai.net',
    path: pathname,
    port: 80,
    method: 'GET',
    headers: {
      'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language':'th-TH,th;q=0.8,en-US;q=0.6,en;q=0.4,ja;q=0.2',
      'Cache-Control':'max-age=0',
      'Connection':'keep-alive',
      'Host':'www.niceoppai.net',
      'If-Modified-Since': new Date().toString().substr(0,28),
      'Upgrade-Insecure-Requests':'1',
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36'
    }
  }
}

var request = function(pathname) {
  var deferred = Q.defer();

  var req = http.request(options(pathname), function (res) {
    var data = '';
    res.on('data', function (chunk) { data += chunk; });
    res.on('end', function () { deferred.resolve(data); });
  });
  req.on('error', function (e) { deferred.reject(e.message); });
  req.end();
  return deferred.promise;
}



var mng = new RegExp('cbo_wpm_mng.*?">(.*?)</select>', 'g');
var chp = new RegExp('cbo_wpm_chp.*?">(.*?)</select>', 'g');
var MangaItems = [];
request('/giant-killing/169/').then(function(data){
  var count = 0;
  var manga = mng.exec(data);

  if(manga) {
    manga[1].match(/<option.*?<\/option>/g).forEach(function(option){
      var list = /<option value="http:\/\/www\.niceoppai\.net(.*?)".*?>(.*?)<\/option>/g.exec(option);
      if(list) {
        MangaItems.push({ name: decodeURI(list[2]), path: decodeURI(list[1]) });
      } else {
        console.log(option);
        count++;
      }
    });
    console.log('err', count);
  }
  
  // fs.readFile('./chunk/onepiece-800.txt', (err, data) => {
  //   if (err) throw err;
  //   console.log(data);
  // });
});