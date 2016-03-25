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


var download = function(url) {
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



var RegManga = new RegExp('cbo_wpm_mng.*?>(.*?)</select>', 'g');
var RegChapter = new RegExp('cbo_wpm_chp.*?>(.*?)</select>', 'g');
var RegImages = new RegExp('<FONT COLOR="WHITE">([\\S\\s]*?)<script type="text/javascript">', 'g');


var MangaItems = [];
request('/giant-killing/169/').then(function(data){
  var count = 0;
  var manga = RegManga.exec(data);

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


  var onExit = false, onNext = true, i = 0;
  do
  {
    if(onNext) {
      onNext = false;
      console.log('Downloading... "'+MangaItems[i].name+'"', MangaItems[i].path+'?all');
      request(MangaItems[i].path+'?all').then(function(data){
        RegChapter.exec(data)[1].match(/<option.*?<\/option>/g).forEach(function(option){
          var id = /<option value="(.*?)".*?<\/option>/g.exec(option)[1];
          var sub = /(\/.*?\/).*?\//g.exec(MangaItems[i].path)[1] + id + '/?all';
          // if(MangaItems[i].path +'?all' === sub) {

          // } else {

          // }
        });

        RegImages.exec(data)[1].match(/<img.*?>/g).forEach(function(image){
          var url = /<img.*?src="(.*?)".*?>/.exec(image)[1];
          console.log(url);
        });

        i++;
        if(i >= MangaItems.length) onExit = true;
      });
    }
  // } while(!onExit);
  } while(false);
  // fs.readFile('./chunk/onepiece-800.txt', (err, data) => {
  //   if (err) throw err;
  //   console.log(data);
  // });
});