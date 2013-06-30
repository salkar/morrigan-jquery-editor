$.widget( "morrigan.morrigan_editor", {

    options: {
        height: '300px',
        width: '700px',
        prefix: 'mrge',
        doctype: '<!DOCTYPE html>',
        iframeStyles: 'assets/morrigan_editor/iframe.css',
        toolbox: [
            [
                ['bold', 'italy', 'format']
            ],
            [
                ['strike']
            ]
        ]
    },

    _options: {
        rangeSelection: false,
        partOfEndElementSelected: false,
        savedSelectionBeforeAction: {}
    },

    browser: {
        opera: false,
        chrome: false,
        ie: false,
        ie7: false,
        ie8: false,
        ff: false,
        other: false
    },

    _actions: [
        {
            name: 'bold',
            view: {
                icon: 'black',
                title: 'Bold'
            },
            onClickHandler: function (self) {
                console.log(self.options.height)
            }
        },
        {
            name: 'italy',
            view: {
                icon: 'red',
                title: 'Italy'
            },
            onClickHandler: function (self) {
                console.log('Italy' + self.options.height)
            }
        },
        {
            name: 'strike',
            view: {
                icon: 'gray',
                title: 'Strike'
            },
            onClickHandler: function (self) {
                console.log('Strike' + self.options.height)
            }
        },
        {
            name: 'format',
            view: {
                text: 'Format',
                title: 'Paragraph format'
            },
            dropdown: {
                width: '150px',
                actionList: [
                    {
                        name: 'p',
                        text: 'Paragraph',
                        onClickHandler: function (self) {
                            self._actionMutateTopSelectedNodes("P");
                        }
                    },
                    {
                        name: 'h1',
                        text: 'Heading 1',
                        onClickHandler: function (self) {
                            self._actionMutateTopSelectedNodes("H1");
                        }
                    },
                    {
                        name: 'h2',
                        text: 'Heading 2',
                        onClickHandler: function (self) {
                            self._actionMutateTopSelectedNodes("H2");
                        }
                    },
                    {
                        name: 'h3',
                        text: 'Heading 3',
                        onClickHandler: function (self) {
                            self._actionMutateTopSelectedNodes("H3");
                        }
                    }
                ]
            }
        }

    ],
 
    _create: function() {
        this._setupMainElement();

        var toolbox = this._formToolbox();
        this.element.append(toolbox);
        var content = this._formContentField();
        this.element.append(content);
        this._setupIframe();

        this._setupContentEditableDefaultBehavior();
        this._bindEvents();
    },

    // Setup main element

    _setupMainElement: function () {
        this._getBrowser();
        this.element.width(this.options.width).height(this.options.height).addClass('morrigan-editor');
    },

    _getBrowser: function () {
        if (navigator.userAgent.indexOf('Opera') != -1) this.browser.opera = true;
        else if (navigator.userAgent.indexOf('Chrome') != -1) this.browser.chrome = true;
        else if (navigator.userAgent.indexOf('Firefox') != -1) this.browser.ff = true;
        else if (navigator.userAgent.indexOf('MSIE') != -1) {
            this.browser.ie = true;
            if (navigator.userAgent.indexOf('MSIE 8') != -1) this.browser.ie8 = true;
            else if (navigator.userAgent.indexOf('MSIE 7') != -1) this.browser.ie7 = true;
        }
        else this.browser.other = true;
    },

    // Bind events

    _bindEvents: function () {
        var self = this;
        $(this.options.toolbox).each(function () {
            $(this).each(function () {
                $(this).each(function () {
                    self._bindEventToAction(this);
                });
            });
        });
    },

    _bindEventToAction: function (action_name) {
        var config = this._getActionConfig(action_name);
        var id = this._generateActionId(action_name);
        if (config.dropdown) {

            this._bindEventToDropDown(config, id);
        } else {
            this._bindEventToSimpleAction(config, id);
        }
    },

    _bindEventToSimpleAction: function (config, id) {
        var self = this;
        $('#' + id).on("click", function () {
            config.onClickHandler(self);
        });
    },

    _bindEventToDropDown: function (config, id) {
        var self = this;
        $('#' + id).on("mousedown", function (e) {
            var target_id = $(e.target).attr('id');
            if (target_id == id) {
                var dropdown = $(this).children('.mrge-action-dropdown');
                if (dropdown.is(':visible')) dropdown.hide();
                else dropdown.show();
            } else {
                var action_name = self._getActionNameFromId(target_id);
                var action_config = self._getDropDownActionConfig(config, action_name);
                action_config.onClickHandler(self);
            }
        });
    },

    _generateActionId: function (action_name) {
        return this.options.prefix + '_' + action_name;
    },

    _getActionNameFromId: function (id) {
        return id.replace(this.options.prefix, '').substring(1);
    },

    // Form toolbox

    _formToolbox: function() {
        var self = this;
        var toolbox_lines = "";
        $(this.options.toolbox).each(function () {
            toolbox_lines += self._formToolboxLine(this);
        });
        toolbox_lines += "<div class='clear'></div>";
        return "<div class='mrge-toolbox'>" + toolbox_lines + "</div>"
    },

    _formToolboxLine: function(arr) {
        var self = this;
        var toolbox_lines = "";
        $(arr).each(function () {
            toolbox_lines += self._formToolboxBlock(this);
        });
        return "<ul>" + toolbox_lines + "</ul>";
    },

    _formToolboxBlock: function (arr) {
        var self = this;
        var block_items = "";
        $(arr).each(function () {
            block_items += self._formToolboxItem(this);
        });
        return "<li>" + block_items + "</li>";
    },

    _formToolboxItem: function (name) {
        var config = this._getActionConfig(name);
        var result = "<a title='" + config['view']['title'] + "'";
        result += " id='" + this._generateActionId(config.name) + "'";
        if (config.dropdown) result += " class='mrge-action-list'";
        if (config.view.icon) {
            result += " style='background: " + config['view']['icon'] + "'";
        }
        if (this.browser.ie) {
            result += " unselectable='on'"
        }
        result += ">";
        if (config.view.text) {
            result += config['view']['text'];
        }
        if (config.dropdown) {
            result += "<div class='mrge-action-dropdown' style='display: none; width:" + config.dropdown.width + "'>";
            var self = this;
            $(config.dropdown.actionList).each( function () {
                result += "<div id='" +
                    self._generateActionId(this.name) + "'" +
                    (self.browser.ie ? "unselectable='on'" : '') +
                    ">" + this.text + "</div>";
            });
            result += "</div>";
        }
        return result + "</a>";
    },

    // Form content field

    _formContentField: function () {
        var content_height = this._calcContentFieldHeight();
        return $("<div class='mrge-content' style='height: " + content_height + "px'><iframe frameborder='0'></iframe></div>");
    },

    _calcContentFieldHeight: function () {
        var toolbox_height = this.element.find('.mrge-toolbox').outerHeight(true);
        return this.element.height() - toolbox_height;
    },

    _setupIframe: function () {
        var iframe = this.element.find('iframe');
        var idoc = iframe.get(0).contentWindow.document;
        idoc.open();
        idoc.write(this.options.doctype);
        idoc.write("<html style='cursor: text;height: 100%;'>");
        idoc.write("<head><link href='" + this.options.iframeStyles + "' media='all' rel='stylesheet' type='text/css'></head>");
        idoc.write("<body contenteditable='true' class='mrge-iframe-body'>" + this._getDefaultIframeBodyContent() + "</body></html>");
        idoc.close();
        iframe.contents().find('body').height(this._calcIframeBodyHeight(iframe));
    },

    _calcIframeBodyHeight: function (iframe) {
        var body = iframe.contents().find('body');
        var diff = body.outerHeight(true) - body.height();
        return iframe.height() - diff
    },

    _getDefaultIframeBodyContent: function () {
//        if (this.browser.ie || this.browser.opera) return "<p></p>";
        //else return "<p><br></p>";
        return "<p>ololo 1 <strong>strong1</strong></p><p>paragraph 2</p><p>paragraph3 <strong>strong 2</strong></p>";
    },

    // Content field custom behavior

    _setupContentEditableDefaultBehavior: function (e) {
        var self = this;
        this.element.find('iframe').contents().find('body').on('keydown',function (e) {
            self._keyDownHandler(e);
        }).on('keyup', function (e) {
            self._keyUpHandler(e);
        });
    },

    _keyDownHandler: function (e) {
        var selection;
        // Prevent to delete last <p><br></p> from ff and webkit
        if (!this.browser.ie && !this.browser.opera) {
            if (e.keyCode == 8) {
                selection = this.element.find('iframe').get(0).contentWindow.getSelection();
                if (this._selectionIsLastSingleEmptyPSelected(selection))
                    e.preventDefault();
            }
        }

        if (this.browser.ff) {
            if (!selection) selection = this.element.find('iframe').get(0).contentWindow.getSelection();
            this._options.partOfEndElementSelected = false;
            this._options.rangeSelection = false;

            if (!this._selectionIsCaret(selection)) {
                this._options.rangeSelection = true;
                if (this._selectionIsPartOfEndElementSelected(selection)) {
                    this._options.partOfEndElementSelected = true;
                }
            }
        }
    },

    _keyUpHandler: function (e) {
        if (this.browser.opera) this._defaultBehaviorChangeTextNodesToP(e);
        if (this.browser.ff && this._options.rangeSelection) {
//            this._options.rangeSelection = false; //?
            this._defaultBehaviorChangeTextNodesToP(e);
            this._defaultBehaviorChangeBrToP(e);
        }
    },

    // Default behavior

    _defaultBehaviorChangeBrToP: function (e) {
        var br = $(e.target).children('br');
        if (br.length != 0) {
            var element = $("<p><br></p>");
            $(br[0]).replaceWith(element);
            var selection = this.element.find('iframe').get(0).contentWindow.getSelection();
            var rng = this.element.find('iframe').get(0).contentWindow.document.createRange();
            rng.setStart(element.get(0), 0);
            selection.removeAllRanges();
            selection.addRange(rng);
        }
    },

    _defaultBehaviorChangeTextNodesToP: function (e) {
        var self = this;
        var textnodes = $(e.target).contents().filter(function () {
            return this.nodeType === 3;
        });

        if (textnodes.length > 0) {
            var text = "";
            textnodes.each(function () {
                text += this.textContent;
            });

            var element = $("<p>" + text + "</p>");
            $(textnodes.get(0)).replaceWith(element);
            if (textnodes.length > 1) $(textnodes.get(1)).remove();
            $(e.target).children('br').remove();

            var selection = self.element.find('iframe').get(0).contentWindow.getSelection();
            var rng = self.element.find('iframe').get(0).contentWindow.document.createRange();

            if (self._options.partOfEndElementSelected) {
                if (textnodes.length > 1) rng.setStart(element.get(0).firstChild, textnodes.get(0).length);
                else rng.setStart(element.get(0).firstChild, 0);
            } else {
                rng.setStart(element.get(0).firstChild, element.text().length);
            }
            selection.removeAllRanges();
            selection.addRange(rng);
        }
    },

    // Support

    _getActionConfig: function (name) {
        return $.grep(this._actions, function (action) {
            return action["name"] == name;
        })[0];
    },

    _getDropDownActionConfig: function (dropDownConfig, name) {
        return $.grep(dropDownConfig.dropdown.actionList, function (action) {
            return action["name"] == name;
        })[0];
    },

    _selectionGet: function () {
        var window = this.element.find('iframe').get(0).contentWindow;
        if (window.getSelection) return window.getSelection();
        return window.document.selection.createRange();
    },

    _selectionIsCaret: function (selection) {
        if (selection.boundingWidth != undefined) return selection.boundingWidth == 0;
        return selection.anchorOffset == selection.focusOffset &&
            selection.anchorNode == selection.focusNode;
    },

    _selectionIsPartOfEndElementSelected: function (selection) {
//        var anchorNode = selection.anchorNode;
//        var focusNode = selection.focusNode;
//        var anchorElement = (anchorNode.nodeType == 3 ? anchorNode.parentNode : anchorNode);
//        var focusElement = (focusNode.nodeType == 3 ? focusNode.parentNode : focusNode);
//        if (anchorElement.offsetTop > focusElement.offsetTop) {
//            return (anchorNode.nodeType == 3) && (anchorNode.nodeValue.length != selection.anchorOffset);
//        } else {
//            return (focusNode.nodeType == 3) && (focusNode.nodeValue.length != selection.focusOffset);
//        }
        if (this._selectionFromTopToBottom(selection))
            return (focusNode.nodeType == 3) && (focusNode.nodeValue.length != selection.focusOffset);
        else
            return (anchorNode.nodeType == 3) && (anchorNode.nodeValue.length != selection.anchorOffset);
    },

    _selectionFromTopToBottom: function (selection) {
        var anchorNode = selection.anchorNode;
        var focusNode = selection.focusNode;
        var anchorElement = (anchorNode.nodeType == 3 ? anchorNode.parentNode : anchorNode);
        var focusElement = (focusNode.nodeType == 3 ? focusNode.parentNode : focusNode);
        return anchorElement.offsetTop < focusElement.offsetTop;
    },

    _selectionIsLastSingleEmptyPSelected: function (selection) {
        return this._selectionIsCaret(selection) &&
            selection.focusNode.nodeName == 'P' &&
            selection.focusNode.innerHTML == '<br>' &&
            $(selection.focusNode).closest('body').children('p').length == 1;
    },

    _selectionGetSelectedTopNodes: function (selection) {
        var startElement = selection.anchorNode;
        var startE = (startElement.parentNode.nodeName == 'BODY' ? startElement : $(startElement).closest('body > *').get(0));
        var endElement = selection.focusNode;
        var endE = (endElement.parentNode.nodeName == 'BODY' ? endElement : $(endElement).closest('body > *').get(0));
        if (startE == endE) return [startE];
        else {
            return this._selectionGetTopNodesInInterval(startE, endE);
        }
    },

    _selectionGetTopNodesInInterval: function (startE, endE) {
        var topNodes = this.element.find('iframe').contents().find('body').children();
        var inSelection = false;
        var result = [];
        $(topNodes).each(function () {
            if (inSelection) {
                if (this == startE || this == endE) inSelection = false;
                result.push(this);
            } else {
                if (this == startE || this == endE) {
                    inSelection = true;
                    result.push(this);
                }
            }

        });
        return result;
    },

    _selectionGetSelectedTopNodesOldIE: function (range) {
        var iframeBody = this.element.find('iframe').contents().find('body');
        var bodyOffsetTop = iframeBody.offset().top;
        var rangeTopOffset = range.offsetTop - bodyOffsetTop;
        var rangeBottomOffset = rangeTopOffset + range.boundingHeight;

        var topNodes = iframeBody.children();
        var result = [];
        $(topNodes).each(function () {
            if ((this.offsetTop >= rangeTopOffset || (this.offsetTop + this.offsetHeight > rangeTopOffset)) && this.offsetTop < rangeBottomOffset) {
                result.push(this);
            }
        });
        return result;
    },

    _selectionIsTextRange: function (selection) {
        return selection.boundingWidth != undefined;
    },

    // Actions

    _actionMutateTopSelectedNodes: function (nodeName) {
        var topNodes;
        var selection = this._selectionGet();
        if (this._selectionIsTextRange(selection)) {
            topNodes = this._selectionGetSelectedTopNodesOldIE(selection);
            if (this.browser.ie7) this._actionSupportSaveSelectionBeforeMutateIE7(selection);
            else if (this.browser.ie8) this._actionSupportSaveSelectionBeforeMutateIE8(selection);

            this._actionSupportMutateNodes(topNodes, nodeName);
            this._actionSupportRestoreSelectionAfterMutateOldIE();
        } else {
            topNodes = this._selectionGetSelectedTopNodes(selection);
            this._actionSupportSaveSelectionBeforeMutate(selection);
            this._actionSupportMutateNodes(topNodes, nodeName);
            this._actionSupportRestoreSelectionAfterMutate();
        }

    },

    _actionSupportMutateNodes: function (nodes, nodeName) {
        $(nodes).each(function () {
            if (this.nodeName != nodeName) {
                $(this).replaceWith("<" + nodeName + ">" + this.innerHTML + "</" + nodeName + ">");
            }
        });
    },

    _actionSupportSaveSelectionBeforeMutate: function (selection) {
        var anchorNodePath = this._actionSupportGetNodePathFromTopElement(selection.anchorNode);
        var focusNodePath = this._actionSupportGetNodePathFromTopElement(selection.focusNode);
        if (this._selectionFromTopToBottom(selection)) {
            this._options.savedSelectionBeforeAction = {
                anchorNodePath: anchorNodePath,
                anchorOffset: selection.anchorOffset,
                focusNodePath: focusNodePath,
                focusOffset: selection.focusOffset
            };
        } else {
            this._options.savedSelectionBeforeAction = {
                anchorNodePath: focusNodePath,
                anchorOffset: selection.focusOffset,
                focusNodePath: anchorNodePath,
                focusOffset: selection.anchorOffset
            };
        }
    },

    _actionSupportSaveSelectionBeforeMutateIE7: function (range) {
        var parentNode = range.parentElement();
        var preCaretTextRange = this.element.find('iframe').get(0).contentWindow.document.body.createTextRange();
        preCaretTextRange.moveToElementText(parentNode);
        preCaretTextRange.setEndPoint("EndToStart", range);
        var offsetToStart = preCaretTextRange.text.length;
        var rangeLength = range.text.replace("\r\n","").length;
        var parentNodePath = this._actionSupportGetNodePathFromTopElement(parentNode);
        this._options.savedSelectionBeforeAction = {
            startOffset: offsetToStart,
            rangeLength: rangeLength,
            parentNodePath: parentNodePath
        };
    },

    _actionSupportSaveSelectionBeforeMutateIE8: function (range) {
        var parentNode = range.parentElement();
        var preCaretTextRange = this.element.find('iframe').get(0).contentWindow.document.body.createTextRange();
        preCaretTextRange.moveToElementText(parentNode);
        preCaretTextRange.setEndPoint("EndToStart", range);
        var offsetToStart = preCaretTextRange.text.length;
        var rangeLength = range.text.length;
        var parentNodePath = this._actionSupportGetNodePathFromTopElement(parentNode);
        this._options.savedSelectionBeforeAction = {
            startOffset: offsetToStart,
            rangeLength: rangeLength,
            parentNodePath: parentNodePath
        };
    },

    _actionSupportRestoreSelectionAfterMutateOldIE: function () {
        var savedSelection = this._options.savedSelectionBeforeAction;
        var parentNode = this._actionSupportGetNodeFromPath(savedSelection.parentNodePath);
        var rng = this.element.find('iframe').get(0).contentWindow.document.body.createTextRange();
        rng.moveToElementText(parentNode);
        rng.moveStart("character", savedSelection.startOffset);
        rng.collapse();
        rng.moveEnd("character", savedSelection.rangeLength);
        rng.select();
    },

    _actionSupportRestoreSelectionAfterMutate: function () {
        var savedSelection = this._options.savedSelectionBeforeAction;
        var anchorNode = this._actionSupportGetNodeFromPath(savedSelection.anchorNodePath);
        var focusNode = this._actionSupportGetNodeFromPath(savedSelection.focusNodePath);

        var selection = this.element.find('iframe').get(0).contentWindow.getSelection();
        var rng = this.element.find('iframe').get(0).contentWindow.document.createRange();

        rng.setStart(anchorNode, savedSelection.anchorOffset);
        rng.setEnd(focusNode, savedSelection.focusOffset);
        selection.removeAllRanges();
        selection.addRange(rng);
    },

    _actionSupportGetNodePathFromTopElement: function (node) {
        var result = [];
        var currentNode = node;
        while (currentNode.nodeName != 'BODY') {
            result.push($(currentNode.parentNode).contents().index(currentNode));
            currentNode = currentNode.parentNode;
        }
        return result;
    },

    _actionSupportGetNodeFromPath: function (path) {
        var currentNode = this.element.find('iframe').contents().find('body');
        while (path.length != 0) {
            var currentChildIndex = path.pop();
            currentNode = currentNode.contents().eq(currentChildIndex);
        }
        return currentNode.get(0);
    }

});