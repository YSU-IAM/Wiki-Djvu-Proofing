var cp = require('child_process');
var express = require('express');
var util = require('util');
var http = require('http');
var request = require('request');
var fs = require('fs');
var crypto = require('crypto');
var exec = require('child_process').exec;

var app = express();
app.use(express.bodyParser());

app.get('/', function(req, res){
    res.header('Content-Type', 'text/html; charset=utf-8');
    fs.createReadStream('index.html').pipe(res);
});
var counter = 0;
app.post('/process/', function(req, res){
    res.header('Content-Type', 'text/plain; charset=utf-8');
    if(!req.body.djvuUrl){
        res.end("Invalid URL.");
    }
    if(!req.body.page){
        res.end("Invalid Page number.");
    }
    var rand = Math.random();
    var djvuName = util.format("%s.djvu", rand);
    var xmlName = util.format("%s.xml", rand);
    var djvu = fs.createWriteStream(djvuName);
    request.get(req.body.djvuUrl).on('end', function(){
        var command = util.format('"%s" --page %d "%s" "%s"', "C:\\Program Files (x86)\\DjVuLibre\\djvutoxml.exe", req.body.page, djvuName, xmlName);
        exec(command, {
            timeout: 50000
        }, function(err, stdout, stderr){
            if(err){
                console.log(err);
                res.end('error');
                return;
            }
            fs.readFile(xmlName, {
                encoding: 'utf8'    
            }, function(err, data){
                if(err){
                    res.end('error');    
                }
                var pieces = [];
                data.replace(/coords=\"(\d+),(\d+),(\d+),(\d+)\">(.*?)<\//g, function(m, c1, c2, c3, c4, contents){
                    pieces.push({
                        position: {
                            top: c4,
                            left: c1
                        },
                        size: {
                            width: (c3 - c1),
                            height: (c2 - c4)
                        },
                        contents: contents
                    });
                    return m;
                });
                res.end(JSON.stringify(pieces));
                
            });
        });
    }).pipe(djvu);
    
});

app.listen(8080);
