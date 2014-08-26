
var webdriver = require('selenium-webdriver');

var self = this;

exports.name = "touchscreen-target";
exports.category = "interactions";



exports.check = function (checker, browser) {
	var sink = checker.sink;
	browser.do ( function (driver) {
        return driver.executeScript(function (args){
            for (index in args.tags) {
                args.components.push(document.documentElement.getElementsByTagName(args.tags[index]));
            }
            return args.components;
        },{
            tags : ["button", "a", "input"]
        ,   components : new Array()
        }).then(function (data){
            var targets = {
                tag : new Array()
            ,   size : new Array()
            ,   location : new Array()
            ,   outerHtml : new Array()
            };
            for(var i in data) {
                for (var j in data[i]) {
                    data[i][j].getTagName().then(function(name){
                        targets.tag.push(name);
                    });
                    data[i][j].getSize().then(function(size){
                        targets.size.push(size);
                    });
                    data[i][j].getLocation().then(function(location){
                        targets.location.push(location);
                    });
                    data[i][j].getOuterHtml().then(function(html){
                        targets.outerHtml.push(html);
                    });
                }
            }
            return targets;
        }).then(function (targets){
            var size = {
                width : null
            ,   height : null
            }
            var smallTargetsDetected = {
                tag : new Array()
            ,   size : new Array()
            ,   location : new Array()
            ,   outerHtml : new Array()
            };
            if(checker.resume["meta-viewport"]){

            }else{
                for(index in targets.size) {
                    if(targets.size[index].width < 48 || targets.size[index].height < 48) {
                        size.width = targets.size[index].width;
                        size.height = targets.size[index].height;
                        smallTargetsDetected.tag.push(targets.tag[index]);
                        smallTargetsDetected.size.push(size);
                        smallTargetsDetected.location.push(targets.location[index]);
                        smallTargetsDetected.outerHtml.push(targets.outerHtml[index]);
                    }
                } 
            }
            return smallTargetsDetected;
        }).then(function (smallTargetsDetected){
            if(smallTargetsDetected.size.length > 0){
                checker.report(sink, "too-small-touchscreen-target", self.name, self.category, smallTargetsDetected);
                return;
            }else{
                checker.report(sink, "ok", self.name, self.category);
            }
        });
    });
}