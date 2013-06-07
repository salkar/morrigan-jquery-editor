$(document).ready(function () {
    var editor = $('#test').morrigan_editor();
    var editor1 = $('#test1').morrigan_editor({height:'500px', prefix:"mrge1"});

//    $('iframe').contents().find('html').on("click", function (e) {
//        console.log($(e.target)[0].nodeName);
//       if ($(e.target)[0].nodeName == "HTML") $(this).find('body').trigger('click');
//    })
//    $('iframe')[0].contentWindow.getSelection()

//    $('iframe').contents().find('html').on("click", function (e) {
//
//        if ($(e.target)[0].nodeName == "HTML") {
////            $(this).find('body').focus();
//            console.log(11)
//            setEndOfContenteditable($(this).find('body').get(0));
//
//        }
//    });

//    function setEndOfContenteditable(contentEditableElement)
//    {
//        var range,selection;
//        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
//        {
//            range = document.createRange();//Create a range (a range is a like the selection but invisible)
//            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
//            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
//            selection = $('iframe')[0].contentWindow.getSelection();//get the selection object (allows you to change selection)
//            selection.removeAllRanges();//remove any selections already made
//            selection.addRange(range);//make the range you have just created the visible selection
//        }
//        else if(document.selection)//IE 8 and lower
//        {
//            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
//            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
//            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
//            range.select();//Select the range (make it the visible selection
//        }
//    }
});

    // Selection

//    _selectionGet : function () {
//        var window = this.element.find('iframe').get(0).contentWindow;
//        if (window.getSelection) return window.getSelection();
//        return window.document.selection.createRange();
//    },
//
//    _selectionIsCaret : function (selection) {
//        if (selection.boundingWidth != undefined) return selection.boundingWidth == 0;
//        return selection.anchorOffset == selection.focusOffset &&
//            selection.anchorNode == selection.focusNode;
//    },
//
//    _selectionPositionOnElement : function (selection) {
//        if (this._selectionIsOldIERange(selection)) return this._selectionPositionOnElementOldIE(selection);
//        return this._selectionPositionOnElementNewBrowsers(selection);
//    },
//
//    _selectionPositionOnElementNewBrowsers : function (selection) {
//        if (!(selection.anchorNode.nextSibling) &&
//            selection.anchorOffset == selection.focusOffset &&
//            selection.anchorOffset == selection.anchorNode.nodeValue.length) return 1;
//        if (!(selection.anchorNode.previousSibling) &&
//            selection.anchorOffset == selection.focusOffset &&
//            selection.anchorOffset == 0) return -1;
//        return 0;
//    },
//
//    _selectionPositionOnElementOldIE : function (range) {
//        var parentElement = range.parentElement();
//        var preCaretTextRange = this.element.find('iframe').get(0).contentWindow.document.body.createTextRange();
//        preCaretTextRange.moveToElementText(parentElement);
//        preCaretTextRange.setEndPoint("EndToEnd", range);
//        if (preCaretTextRange.text == parentElement.innerText) return 1;
//        if (preCaretTextRange.text == "") return -1;
//        return 0;
//    },
//
//    _selectionIsOldIERange: function (selection) {
//        return selection.offsetLeft != undefined;
//    }

