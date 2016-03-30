var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Q = require('q')

var request = function(pathname) {
  var deferred = Q.defer();
  var req = http.request({
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
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36'
    }
  }, function(res) {
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

request('/giant-killing/169/').then(function(data){
  var items = [];
  var deferred = Q.defer();
  var count = 0;
  var manga = RegManga.exec(data);

  if(manga) {
    manga[1].match(/<option.*?<\/option>/g).forEach(function(option){
      var list = /<option value="http:\/\/www\.niceoppai\.net(.*?)".*?>(.*?)<\/option>/g.exec(option);
      if(list) {
        items.push({ name: decodeURI(list[2]), path: decodeURI(list[1]) });
      } else {
        console.log(option);
        count++;
      }
    });
    console.log('err', count);
    deferred.resolve(items);
  } else {
    deferred.reject();
  }
  return deferred.promise;
}).then(function(MangaItems){

  waterfall(MangaItems.map(function (item) {
    return function (lastItemResult, nextCallback) {
      // same execution for each item in the array 
      var itemResult = doThingsWith(arrayItem, lastItemResult);
      // results carried along from each to the next 
      nextCallback(null, itemResult);
  }}), function (err, result) {
    // final callback 
  });

}).catch(function(e){
  console.log('error', e);
});








// console.log('get manga', MangaItems.length);
// var onExit = false, onNext = true, i = 0, TotalImages = 0, ListExit = false, ListCount = 0, l = 0;
// MangaItems.forEach(function(item){
//   console.log('Downloading... '+item.path+'?all');
//   request(MangaItems[i].path+'?all').then(function(data){
//     RegChapter.exec(data)[1].match(/<option.*?<\/option>/g).forEach(function(option){
//       var id = /<option value="(.*?)".*?<\/option>/g.exec(option)[1];
//       var sub = /(\/.*?\/).*?\//g.exec(MangaItems[i].path)[1] + id + '/?all';
//       // if(MangaItems[i].path +'?all' === sub) {

//       // } else {

//       // }
//     }); 

//     var ListImages = RegImages.exec(data)[1].match(/<img.*?>/g);
//     TotalImages = ListImages.length;
//     ListImages.forEach(function(image){
//       var link = /<img.*?src="(.*?)".*?>/.exec(image)[1];
//       var dir = './niceoppai'+item.path;
//       var filename = path.basename(link);
//       fs.exists(dir + filename, (exists) => {
//         if(!exists) {
//           mkdirp(dir, () =>{
//             console.log('make', dir);
//             var file = fs.createWriteStream(dir + filename);
//             http.get(link, (response) => { 
//               response.pipe(file); 
//               response.on('end', () => {
//                 console.log(dir, filename);
//                 ListCount++;
//               });
//             });
//           });
//         }
//       });
//     });
//   });
// // } while(!onExit);
// });
// // fs.readFile('./chunk/onepiece-800.txt', (err, data) => {
// //   if (err) throw err;
// //   console.log(data);
// // });
// waterfall(myArray.map(function (arrayItem) {
//   return function (lastItemResult, nextCallback) {
//     // same execution for each item in the array 
//     var itemResult = doThingsWith(arrayItem, lastItemResult);
//     // results carried along from each to the next 
//     nextCallback(null, itemResult);
// }}), function (err, result) {
//   // final callback 
// });