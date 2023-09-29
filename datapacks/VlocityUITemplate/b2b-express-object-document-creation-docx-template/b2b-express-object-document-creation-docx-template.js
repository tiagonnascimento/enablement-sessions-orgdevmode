baseCtrl.prototype.setDocXIPScope = function(scp) {
    'use strict';
    let library = {};
    var afterSlash = '/' + window.location.href.split('.com/')[1].split('/')[0];
    window.VlocOmniSI = scp;
    if (afterSlash === 'apex') {
        afterSlash = '';
    }
    scp.applyCallResp({
        urlPrefix: window.location.origin + afterSlash
    });

    window.bpTreeResponseSent = false;
    window.addEventListener('message', function(event) {
        if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('docGenContentVersionId')) {
            baseCtrl.prototype.$scope.bpTree.response.isWordAttachDone = true;
            let WordAttachmentDone = library.getElementData("GenerationOptions:isWordAttachDone");
            library.setElementData("GenerationOptions:isWordAttachDone",true);
            window.VlocOmniSI.applyCallResp(event.data);
            scp.aggregate(scp, scp.control.index, scp.control.indexInParent, true, -1);
        }
        else if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('pdfGenContentVersionId')) {
            baseCtrl.prototype.$scope.bpTree.response.isPDFAttachDone = true;
            let PdfAttachmentDone = library.getElementData("GenerationOptions:isPDFAttachDone");
            library.setElementData("GenerationOptions:isPDFAttachDone",true);
            window.VlocOmniSI.applyCallResp(event.data);
            scp.aggregate(scp, scp.control.index, scp.control.indexInParent, true, -1);

        }
        if (event.data && event.data.constructor === Object && event.data.hasOwnProperty('GET_BPTREE_RESPONSE')) {
            if (!window.bpTreeResponseSent) {
                var fContentWindow = document.getElementById('obj-doc-creation-docx-os-iframe').contentWindow;
                fContentWindow.postMessage({'clmDocxBpTreeResponse': baseCtrl.prototype.$scope.bpTree.response}, '*');
                window.bpTreeResponseSent = true;
            }
        }
    }, false);

    library.getElementData = function(name) {
        // Accept either colons or periods as path seperators
        let namePath = name.split(/[:\.]/);
        let cursor = baseCtrl.prototype.$scope.bpTree.response;
        let p;
        while (undefined !== (p = namePath.shift())) {
            if (p.startsWith('#')) {
                p = p.substr(1);
                let kv = p.split('=');
                let newCursor = undefined;
                for (let i = 0; i < cursor.length; i++) {
                    if (cursor[i][kv[0]] == kv[1]) {
                        newCursor = cursor[i];
                        break;
                    }
                }
                cursor = newCursor;
            } else {
                cursor = cursor[p];
            }
            if (cursor === undefined) {
                break;
            }
        }

        return cursor;
    };

    library.setElementData = function(name, value) {
        var toSet = value;
        // Accept either colons or periods as path seperators
        let namePath = name.split(/[:\.]/);

        for (var i = namePath.length - 1; i >= 0; i--) {
            var newSet = {};
            newSet[namePath[i]] = toSet;
            toSet = newSet;
        }

        baseCtrl.prototype.$scope.applyCallResp(toSet);
    };
};