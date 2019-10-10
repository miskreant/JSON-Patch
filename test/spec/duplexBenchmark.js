var obj, obj2, patches;
if (typeof window === 'undefined') {
    const { JSDOM } = require("jsdom");
    const dom = new JSDOM();
    global.window = dom.window;
    global.document = dom.window.document;
}

if (typeof jsonpatch === 'undefined') {
    jsonpatch = require('./../../src/json-patch-duplex.js');
}


if (typeof Benchmark === 'undefined') {
    var Benchmark = require('benchmark');
    var benchmarkResultsToConsole = require('./../helpers/benchmarkReporter.js').benchmarkResultsToConsole;
}


var suite = new Benchmark.Suite;
suite.add('generate operation', function() {
    obj = {
        firstName: "Albert",
        lastName: "Einstein",
        phoneNumbers: [{
            number: "12345"
        }, {
            number: "45353"
        }]
    };
    var observer = jsonpatch.observe(obj);

    obj.firstName = "Joachim";
    obj.lastName = "Wester";
    obj.phoneNumbers[0].number = "123";
    obj.phoneNumbers[1].number = "456";

    var patches = jsonpatch.generate(observer);
    obj2 = {
        firstName: "Albert",
        lastName: "Einstein",
        phoneNumbers: [{
            number: "12345"
        }, {
            number: "45353"
        }]
    };

    jsonpatch.apply(obj2, patches);
});
suite.add('compare operation', function() {
    var obj = {
        firstName: "Albert",
        lastName: "Einstein",
        phoneNumbers: [{
            number: "12345"
        }, {
            number: "45353"
        }]
    };
    var obj2 = {
        firstName: "Joachim",
        lastName: "Wester",
        mobileNumbers: [{
            number: "12345"
        }, {
            number: "45353"
        }]
    };

    var patches = jsonpatch.compare(obj, obj2);
});

// if we are in the browser with benchmark < 2.1.2
if(typeof benchmarkReporter !== 'undefined'){
    benchmarkReporter(suite);
} else {
    suite.on('complete', function () {
        benchmarkResultsToConsole(suite);
    });
    suite.run();
}
