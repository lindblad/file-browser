#!/usr/bin/env node

var http = require('http');
var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var path = require('path');
var util = require('util');
var azureStorage = require('azure-storage');
var blobService = azureStorage.createBlobService();

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('$0', 'Browse file system.')
  .example('$0 -e .js .swf .apk', 'Exclude extensions while browsing.')
  .alias('i', 'include')
  .array('i')
  .describe('i', 'File extension to include.')
  .alias('e', 'exclude')
  .array('e')
  .describe('e', 'File extensions to exclude.')
  .alias('p', 'port')
  .describe('p', 'Port to run the file-browser. [default:8088]')
  .help('h')
  .alias('h', 'help')
  // .describe('h', '')
  // .epilog('copyright 2015')
  // .demandOption(['i', 'e']) // required fields
  .check(_checkValidity)
  .argv;

function _checkValidity(argv) {
  if (argv.i && argv.e) return new Error('Select -i or -e.');
  if (argv.i && argv.i.length == 0) return new Error('Supply at least one extension for -i option.');
  if (argv.e && argv.e.length == 0) return new Error('Supply at least one extension for -e option.');
  return true;
}

function collect(val, memo) {
  if(val && val.indexOf('.') != 0) val = "." + val;
  memo.push(val);
  return memo;
}

var app = express();
var dir =  process.cwd();
app.use(express.static(dir)); //app public directory
app.use(express.static(__dirname)); //module directory
var server = http.createServer(app);

if(!argv.port) argv.port = 8088;

server.listen(argv.port);
console.log("Please open the link in your browser http://localhost:" + argv.port);

app.get('/files', function(req, res) {
  var query = req.query.path || '';
  currentDir = query;
  console.log("browsing ", currentDir);

  let prefix = `${query}`
  let retVal = [];

  blobService.listBlobsSegmentedWithPrefix('apples-stockba56a77b-aca6-4506-a3cb-3f941c658cfb', prefix, null, function (error, results) {
      if (error) {
          // List blobs error
      } else {
        let path = "";
        let files = results.entries.reduce((prev, next) => {
            prev.push(next.name.replace(prefix, ""));
            return prev;
          }, [])
          .reduce((prev, next) => {
            paht = next;
            let isFolder = next.indexOf('/') >= 0;
            let currentLevel = isFolder ? next.substr(0, next.indexOf('/')) : next;
            let hasIt = prev.some(it => {
              return it.Name === currentLevel;
            });
            if (hasIt) {
              return prev;
            }
            prev.push({ Name : currentLevel, IsDirectory: isFolder, Path : isFolder ? `${prefix}${currentLevel}/` : next  });
            return prev;
          }, []);
        res.json(files);
      }
  });
});

app.get('/', function(req, res) {
 res.redirect('lib/template.html'); 
});
