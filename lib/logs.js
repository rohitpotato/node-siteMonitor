
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');


var lib = {};


var baseDir = path.join(__dirname,'/../.logs/');


lib.append = function(file,str,callback){

  fs.open(baseDir+file+'.log', 'a', function(err, fileDescriptor){
    if(!err && fileDescriptor){

      fs.appendFile(fileDescriptor, str+'\n',function(err){
        if(!err){
          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false);
            } else {
              callback('Error closing file that was being appended');
            }
          });
        } else {
          callback('Error appending to file');
        }
      });
    } else {
      callback('Could open file for appending');
    }
  });
};

lib.list = function(includeCompressedLogs, callback) {

    fs.readdir(baseDir, function(err, data) {

      var trimmedFiles = [];
      if(!err && data && data.length > 0) {

        data.forEach(function(filename) {

            if(filename.indexOf('.log') > -1) {

              trimmedFiles.push(filename.replace('.log', ''));
            }

            if(filename.indexOf('.gz.b64') && includeCompressedLogs) {

              trimmedFiles.push(filename.replace('.gz.b64', ''));
            }
        }); 

        callback(false, trimmedFiles);  

      } else {

        callback(err, data);
      }

    });
};

lib.compress = function(logId, newFileId, callback) {

  var sourceFile =  logId+'.log';
  var destFile = newFileId+'gs.b64';

  fs.readFile(baseDir+sourceFile, 'utf-8', function(err, inputString) {

    if(!err && inputString) {

      zlib.gzip(inputString, function(err, buffer) {

        fs.open(baseDir+destFile, 'wx', function(err, fileDescriptor) {

            if(!err && fileDescriptor) {

              fs.write(fileDescriptor, buffer.toString('base64'), function(err) {

                if(!err) {

                  fs.close(fileDescriptor, function(err) {

                    if(!err) {

                      callback(false);

                    } else {

                        callback(err);
                    }

                  });

                } else {

                    callback(err);
                }

              });

            }  else {

                callback(err);
            } 
        });

      });

    } else {

      callback(err);
    }

  });

};


lib.decompress = function(fileId,callback){
  var fileName = fileId+'.gz.b64';
  fs.readFile(baseDir+fileName, 'utf8', function(err,str){
    if(!err && str){
     
      var inputBuffer = Buffer.from(str, 'base64');
      zlib.unzip(inputBuffer,function(err,outputBuffer){
        if(!err && outputBuffer){
     
          var str = outputBuffer.toString();
          callback(false,str);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};


lib.truncate = function(logId,callback){
  fs.truncate(baseDir+logId+'.log', 0, function(err){
    if(!err){
      callback(false);
    } else {
      callback(err);
    }
  });
};


module.exports = lib;