$.widget( "morrigan.morrigan_editor", {

    options: {
        height: '300px',
        width: '700px',
        prefix: 'mrge',
        doctype: '<!DOCTYPE html>',
        iframeStyles: 'assets/morrigan_editor/iframe.css',
        toolbox: [
            [
                ['bold', 'italy', 'format'], ['img']
            ],
            [
                ['strike']
            ]
        ]
    },

    _options: {
        rangeSelection: false,
        partOfEndElementSelected: false,
        savedSelectionBeforeAction: {},
        nodesMutated: false,
        selectionInIframe: false,
        currentGlobalSelection:null,
        currentEditorSelection: null,
        currentPopupAction: null
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
            name: 'img',
            view: {
                disabledIcon: 'orange',
                icon: '#CCCC99',
                title: 'Image'
            },
            popup: {
                html: '<form><input type="file" name="upload_img"/></form>',
                onClickHandler: function (self, config, e) {
                    console.log('ololo')
                }
            }
        },
        {
            name: 'bold',
            view: {
                disabledIcon: 'orange',
                activeIcon:'#3366CC',
                icon: 'black',
                title: 'Bold'
            },
            onClickHandler: function (self, config, e) {
                var actionId = self._generateActionId(config.name);
                var isActive = self._actionIsActive(actionId);
                self.element.find('iframe').get(0).contentWindow.document.execCommand('bold', false, null);
                if (isActive) self._actionDeactivate(actionId, config);
                else self._actionActivate(actionId, config);
            },
            selectionHandler: {
                onSelectionChange: function (self, config, e) {
                    var actionId = self._generateActionId(config.name);
                    var isActive = self._actionIsActive(actionId);
                    if (self.element.find('iframe').get(0).contentWindow.document.queryCommandState('bold')) {
                        if (!isActive) self._actionActivate(actionId, config);
                    } else {
                        if (isActive) self._actionDeactivate(actionId, config);
                    }
                }
            }
        },
        {
            name: 'italy',
            view: {
                disabledIcon: 'orange',
                activeIcon: 'green',
                icon: 'red',
                title: 'Italy'
            },
            onClickHandler: function (self, config) {
                var actionId = self._generateActionId(config.name);
                var isActive = self._actionIsActive(actionId);
                self.element.find('iframe').get(0).contentWindow.document.execCommand('italic', false, null);
                if (isActive) self._actionDeactivate(actionId, config);
                else self._actionActivate(actionId, config);
            },
            selectionHandler: {
                onSelectionChange: function (self, config, e) {
                    var actionId = self._generateActionId(config.name);
                    var isActive = self._actionIsActive(actionId);
                    if (self.element.find('iframe').get(0).contentWindow.document.queryCommandState('italic')) {
                        if (!isActive) self._actionActivate(actionId, config);
                    } else {
                        if (isActive) self._actionDeactivate(actionId, config);
                    }
                }
            }
        },
        {
            name: 'strike',
            view: {
                disabledIcon: 'orange',
                activeIcon: "#66FF00",
                icon: 'gray',
                title: 'Strike'
            },
            onClickHandler: function (self, config) {
                var actionId = self._generateActionId(config.name);
                var isActive = self._actionIsActive(actionId);
                self.element.find('iframe').get(0).contentWindow.document.execCommand('strikethrough', false, null);
                if (isActive) self._actionDeactivate(actionId, config);
                else self._actionActivate(actionId, config);
            },
            selectionHandler: {
                onSelectionChange: function (self, config, e) {
                    var actionId = self._generateActionId(config.name);
                    var isActive = self._actionIsActive(actionId);
                    if (self.element.find('iframe').get(0).contentWindow.document.queryCommandState('strikethrough')) {
                        if (!isActive) self._actionActivate(actionId, config);
                    } else {
                        if (isActive) self._actionDeactivate(actionId, config);
                    }
                }
            }
        },
        {
            name: 'format',
            view: {
                text: 'Format',
                title: 'Paragraph format'
            },
            selectionHandler: {
                onCaretSelectionChange: function (self, config, e) {
                    var topNode = $(e.target).closest('body > *').get(0);
                    if (topNode) {
                        var topNodeName = $(e.target).closest('body > *').get(0).nodeName;
                        var actionStatusText = self._configGetTextForNameFromActionList(config, topNodeName);
                        var actionId = self._generateActionId(config.name);
                        self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                    }

                },
                onRangeSelectionChange: function (self, config, e) {
                    var selection = self._selectionGet();
                    var topNodes = self._selectionGetSelectedTopNodes(selection);
                    var topNodesName, differentTopNodes, actionStatusText;
                    $(topNodes).each(function () {
                        if (topNodesName) {
                            if (topNodesName != this.nodeName) differentTopNodes = true;
                            return;
                        } else topNodesName = this.nodeName;
                    });

                    if (differentTopNodes) {
                        actionStatusText = self._configGetDefaultText(config);
                    } else {
                        actionStatusText = self._configGetTextForNameFromActionList(config, topNodesName);
                    }
                    var actionId = self._generateActionId(config.name);
                    self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                }
            },
            dropdown: {
                width: '150px',
                actionList: [
                    {
                        name: 'P',
                        text: 'Paragraph',
                        onClickHandler: function (self, config) {
                            self._actionMutateTopSelectedNodes("P");
                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'P');
                            var actionId = self._generateActionId(config.name);
                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                        }
                    },
                    {
                        name: 'H1',
                        text: 'Heading 1',
                        onClickHandler: function (self, config) {
                            self._actionMutateTopSelectedNodes("H1");
                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'H1');
                            var actionId = self._generateActionId(config.name);
                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                        }
                    },
                    {
                        name: 'H2',
                        text: 'Heading 2',
                        onClickHandler: function (self, config) {
                            self._actionMutateTopSelectedNodes("H2");
                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'H2');
                            var actionId = self._generateActionId(config.name);
                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                        }
                    },
                    {
                        name: 'H3',
                        text: 'Heading 3',
                        onClickHandler: function (self, config) {
                            self._actionMutateTopSelectedNodes("H3");
                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'H3');
                            var actionId = self._generateActionId(config.name);
                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
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
        var popup = this._formPopup();
        this.element.append(popup);
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
        this._bindEventsToIframeDocument();
        this._bindEventsToMainElement();
        this._bindEventToPopupActions();
    },

    _bindEventsToIframeDocument: function () {
        var self = this;
        this.element.find('iframe').contents().find('body').on("focus", function () {
            if (!self._options.selectionInIframe) {
                self._options.selectionInIframe = true;
                var disabledActions = self.element.find('.mrge-disabled');
                disabledActions.removeClass('mrge-disabled');
                disabledActions.each(function () {
                    var elementId = $(this).attr('id');
                    var actionName = self._getActionNameFromId(elementId);
                    var config = self._getActionConfig(actionName);
                    var icon = self._configGetIcon(config);
                    if (icon) $(this).css("background", icon);
                });
            }
        });

    },

    _bindEventsToMainElement: function () {
        var self = this;
        this.element.on("mouseenter", function () {
            if (self.browser.ie) {
                self._selectionSaveGlobalSelection();
                self._selectionRestoreEditorSelection();
            }
        }).on("mouseleave", function () {
            if (self.browser.ie) {
                self._selectionSaveEditorSelection();
                self._selectionRestoreGlobalSelection();
            }
        });
    },

    _bindEventToAction: function (action_name) {
        var config = this._getActionConfig(action_name);
        var id = this._generateActionId(action_name);
        if (config.selectionHandler) this._bindEventToSelectionChangedHandler(config);
        if (config.dropdown) {
            this._bindEventToDropDown(config, id);
        } else if (config.popup) {
            this._bindEventToPopup(config, id);
        } else {
            this._bindEventToSimpleAction(config, id);
        }
    },

    _bindEventToSimpleAction: function (config, id) {
        var self = this;
        $('#' + id).on("click", function () {
            if (!self._options.selectionInIframe) return;
            config.onClickHandler(self, config);
        });
    },

    _bindEventToDropDown: function (config, id) {
        var self = this;
        $('#' + id).on("mousedown", function (e) {
            if (!self._options.selectionInIframe) return;
            var target_id = $(e.target).attr('id') || (($(e.target).hasClass('mrge-dropdown-text')) ?  $(e.target.parentNode).attr('id') : null);
            if (target_id == id) {
                var dropdown = $(this).children('.mrge-action-dropdown');
                if (dropdown.is(':visible')) dropdown.hide();
                else dropdown.show();
            } else {
                var action_name = self._getActionNameFromId(target_id);
                var action_config = self._getDropDownActionConfig(config, action_name);
                action_config.onClickHandler(self, config);
            }
        });
    },

    _bindEventToPopup: function (config, id) {
        var self = this;
        $('#' + id).on("mousedown", function (e) {
            if (self._options.selectionInIframe) self._popupShow(id);
        });
    },

    _bindEventToPopupActions: function () {
        var self = this;
        this.element.find('.mrge-popup').find('.mrge-popup-ok').on("mousedown", function (e) {
            var config = self._getActionConfig(self._options.currentPopupAction);
            config.popup.onClickHandler(self, config, e);
        });
        this.element.find('.mrge-popup').find('.mrge-popup-cancel').on("mousedown", function (e) {
            self._popupHide();
        });
        this.element.find('.mrge-popup').find('.mrge-popup-close').on("mousedown", function (e) {
            self._popupHide();
        });
        this.element.find('.mrge-popup-overlay').on("mousedown", function (e) {
            self._popupHide();
        });
    },

    _bindEventToSelectionChangedHandler: function (config) {
        var iframe = this.element.find('iframe');
        var self = this;
        iframe.contents().on("mouseup", function (e) {
            self._bindEventHandlersToSelectionChanged(config, e);
        }).on("keyup", function (e) {
            var keyCodesAffectedDomChanges = [8,13,33,34,35,36,37,38,39,40,46];
            if ($.inArray(e.keyCode, keyCodesAffectedDomChanges) != -1)
                self._bindEventHandlersToSelectionChanged(config, e);
        });
    },

    _bindEventHandlersToSelectionChanged: function (config, e) {
        if (config.selectionHandler.onSelectionChange) config.selectionHandler.onSelectionChange(this, config, e);
        else {
            var selection = this._selectionGet();
            if (this._selectionIsCaret(selection)) config.selectionHandler.onCaretSelectionChange(this, config, e);
            else config.selectionHandler.onRangeSelectionChange(this, config, e);
        }
    },

    _generateActionId: function (actionName) {
        return this.options.prefix + '_' + actionName;
    },

    _getActionNameFromId: function (id) {
        return id.replace(this.options.prefix, '').substring(1);
    },

    // Popup

    _popupShow: function (id) {
        var name = this._getActionNameFromId(id);
        this._options.currentPopupAction = name;
        this._popupConfigure(name);
        this._popupLocateAndShow();
    },

    _popupHide: function () {
        this.element.find('.mrge-popup-wrapper').hide();
    },

    _popupConfigure: function (name) {
        var config = this._getActionConfig(name);
        $('.mrge-popup').find('.mrge-popup-content').empty().append(config.popup.html);
    },

    _popupLocateAndShow: function () {
        var popup = $('.mrge-popup');
        var y = this.element.height() / 2 - popup.height() / 2;
        var x = this.element.width() / 2 - popup.width() / 2;
        y = (y < 0 ? 0 : y);
        x = (x < 0 ? 0 : x);
        popup.css('top', y);
        popup.css('left', x);
        popup.parent().show();
    },

    _formPopup: function () {
        return "<div class='mrge-popup-wrapper'>" +
            "<div class='mrge-popup-overlay'></div>" +
            "<div class='mrge-popup'>" +
            "<div class='mrge-popup-header'><div class='mrge-popup-close'></div><div class='clear'></div></div>" +
            "<div class='mrge-popup-content'></div>" +
            "<div class='mrge-popup-actions'><div class='mrge-popup-ok mrge-popup-btn'>Ok</div><div class='mrge-popup-cancel mrge-popup-btn'>Cancel</div></div>" +
            "</div>";
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
        if (config.dropdown) result += " class='mrge-action-list mrge-disabled'";
        else result += " class='mrge-disabled'";
        if (config.view.disabledIcon) {
            result += " style='background: " + config['view']['disabledIcon'] + "'";
        }
        if (this.browser.ie) {
            result += " unselectable='on'"
        }
        result += ">";
        if (config.view.text) {
            result += '<span class="mrge-dropdown-text"';
            if (this.browser.ie) {
                result += " unselectable='on'"
            }
            result += '>' + config['view']['text'] + '</span>';
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
        if (this.browser.ie || this.browser.opera) return "<p></p>";
        else return "<p><br></p>";
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

    // Config

    _getActionConfig: function (name) {
        return $.grep(this._actions, function (action) {
            return action["name"] == name;
        })[0];
    },

    _configGetTextForNameFromActionList: function (config, name) {
        return this._getDropDownActionConfig(config, name).text;
    },

    _configGetIcon: function (config) {
        return config.view.icon;
    },

    _configGetActiveIcon: function (config) {
        return config.view.activeIcon;
    },

    _configGetDefaultText: function (config) {
        return config.view.text;
    },

    _getDropDownActionConfig: function (dropDownConfig, name) {
        return $.grep(dropDownConfig.dropdown.actionList, function (action) {
            return action["name"] == name;
        })[0];
    },

    // Selection

    _selectionGet: function () {
        var window = this.element.find('iframe').get(0).contentWindow;
        if (window.getSelection) return window.getSelection();
        return window.document.selection.createRange();
    },

    _textRangeGetGlobal: function () {
        return document.selection.createRange();
    },

    _textRangeGetIframe: function () {
        return this.element.find('iframe').get(0).contentWindow.document.selection.createRange();
    },

    _textRangeEmpty: function (textRange) {
        return textRange.boundingHeight == 0 && textRange.boundingWidth == 0;
    },

    _textRangeInIframe: function (textRange) {
        return $(textRange.parentElement()).closest('.mrge-iframe-body').length == 1;
    },

    _selectionSaveGlobalSelection: function () {
        console.log("save global selection");
        var textRange = this._textRangeGetGlobal();
        this._options.currentGlobalSelection = ((this._textRangeEmpty(textRange) || this._textRangeInIframe(textRange)) ? null : textRange);
    },

    _selectionSaveEditorSelection: function () {
        console.log("save editor selection");
        var textRange = this._textRangeGetIframe();
        this._options.currentEditorSelection = (this._textRangeEmpty(textRange) ? null : textRange);
    },

    _selectionRestoreGlobalSelection: function () {
        var textRange = this._options.currentGlobalSelection;
        if (textRange != null) textRange.select();
    },

    _selectionRestoreEditorSelection: function () {
        var textRange = this._options.currentEditorSelection;
        if (textRange != null) textRange.select();
    },

//    _selectionSaveCurrentSelection: function () {
//        console.log("save")
//        var selection = this._selectionGet();
//        this._options.currentSelection = selection.getRangeAt(0);
//    },

//    _selectionRestoreCurrentSelection: function () {
//        var selection = this._options.currentSelection;
//        if (this._selectionIsTextRange(selection)) {
//            this._selectionRestoreCurrentSelectionOldIE(selection);
//        } else {
//            this._selectionRestoreCurrentSelectionNewIE(selection);
//        }
//    },
//
//    _selectionRestoreCurrentSelectionOldIE: function () {
//        console.log("old ie")
//    },
//
//    _selectionRestoreCurrentSelectionNewIE: function () {
//        console.log("new ie")
//        var rangeToRestore = this._options.currentSelection;
//        var currentSelection = this._selectionGet();
//        currentSelection.removeAllRanges();
//        console.log(this._options.currentSelection);
//        currentSelection.addRange(this._options.currentSelection);
//    },

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
//        var anchorNode = selection.anchorNode;
//        var focusNode = selection.focusNode;
//        var anchorElement = (anchorNode.nodeType == 3 ? anchorNode.parentNode : anchorNode);
//        var focusElement = (focusNode.nodeType == 3 ? focusNode.parentNode : focusNode);
//        if (anchorElement.offsetTop != focusElement.offsetTop) return anchorElement.offsetTop < focusElement.offsetTop;
//        return anchorElement.offsetLeft < focusElement.offsetLeft;
        var rng = this.element.find('iframe').get(0).contentWindow.document.createRange();
        rng.setStart(selection.anchorNode, selection.anchorOffset);
        rng.setEnd(selection.focusNode, selection.focusOffset);
        return rng.startOffset == selection.anchorOffset && rng.startContainer == selection.anchorNode;
    },

    _selectionIsLastSingleEmptyPSelected: function (selection) {
        return this._selectionIsCaret(selection) &&
            selection.focusNode.nodeName == 'P' &&
            selection.focusNode.innerHTML == '<br>' &&
            $(selection.focusNode).closest('body').children('p').length == 1;
    },

    _selectionGetSelectedTopNodes: function (selection) {
        if (this.browser.ie7) return this._selectionGetSelectedTopNodesIE7(selection);
        if (this.browser.ie8) return this._selectionGetSelectedTopNodesIE8(selection);
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

    _selectionGetSelectedTopNodesIE7: function (range) {
        var iframeBody = this.element.find('iframe').contents().find('body');
        var bodyOffsetTop = iframeBody.offset().top;
        var iframeScrollTop = this.element.find('iframe').contents().find('html')[0].scrollTop;
        var rangeTopOffset = range.offsetTop + iframeScrollTop - bodyOffsetTop;
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

    _selectionGetSelectedTopNodesIE8: function (range) {
        var iframeBody = this.element.find('iframe').contents().find('body');
        var iframeScrollTop = this.element.find('iframe').contents().find('html')[0].scrollTop;
        var rangeTopOffset = range.boundingTop + iframeScrollTop;
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

            if (this.browser.ie7) {
                topNodes = this._selectionGetSelectedTopNodesIE7(selection);
                this._actionSupportSaveSelectionBeforeMutateIE7(selection, topNodes);
            }
            else if (this.browser.ie8) {
                topNodes = this._selectionGetSelectedTopNodesIE8(selection);
                this._actionSupportSaveSelectionBeforeMutateIE8(selection, topNodes);
            }

            this._actionSupportMutateNodes(topNodes, nodeName);
            if (this._options.nodesMutated) {
                this._actionSupportRestoreSelectionAfterMutateOldIE();
            }
        } else {
            topNodes = this._selectionGetSelectedTopNodes(selection);
            this._actionSupportSaveSelectionBeforeMutate(selection);
            this._actionSupportMutateNodes(topNodes, nodeName);
            if (this._options.nodesMutated) {
                this._actionSupportRestoreSelectionAfterMutate();
            }
        }

    },

    _actionChangeDropDownCurrentState: function (id, state) {
        $('#' + id).children('span').text(state);
    },

    _actionIsActive: function (id) {
        return $('#' + id).hasClass('mrge-active');
    },

    _actionActivate: function (id, config) {
        var action = $('#' + id);
        var icon = this._configGetActiveIcon(config);
        if (icon) action.css("background", icon);
        action.addClass('mrge-active');
    },

    _actionDeactivate: function (id, config) {
        var action = $('#' + id);
        var icon = this._configGetIcon(config);
        if (icon) action.css("background", icon);
        action.removeClass('mrge-active');
    },

    _actionSupportMutateNodes: function (nodes, nodeName) {
        this._options.nodesMutated = false;
        var mutated = false;
        $(nodes).each(function () {
            if (this.nodeName != nodeName) {
                $(this).replaceWith("<" + nodeName + ">" + this.innerHTML + "</" + nodeName + ">");
                mutated = true;
            }
        });
        if (mutated) this._options.nodesMutated = true;
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

    _actionSupportSaveSelectionBeforeMutateIE7: function (range, topNodes) {
        var parentNode = range.parentElement();
        var preCaretTextRange = this.element.find('iframe').get(0).contentWindow.document.body.createTextRange();
        preCaretTextRange.moveToElementText(parentNode);
        preCaretTextRange.setEndPoint("EndToStart", range);
        var offsetToStart = preCaretTextRange.text.replace(/\r\n/g," ").length;
        if (range.text.indexOf($(topNodes[0]).text()) == 0) offsetToStart += 1;
        var rangeLength = range.text.replace(/\r\n/g," ").length;
        var parentNodePath = this._actionSupportGetNodePathFromTopElement(parentNode);
        this._options.savedSelectionBeforeAction = {
            startOffset: offsetToStart,
            rangeLength: rangeLength,
            parentNodePath: parentNodePath
        };
    },

    _actionSupportSaveSelectionBeforeMutateIE8: function (range, topNodes) {
        var parentNode = range.parentElement();
        var preCaretTextRange = this.element.find('iframe').get(0).contentWindow.document.body.createTextRange();
        preCaretTextRange.moveToElementText(parentNode);
        preCaretTextRange.setEndPoint("EndToStart", range);
        var nodesBeforeFirstSelectedCount = 0;
        if (parentNode.nodeName == 'BODY') {
            nodesBeforeFirstSelectedCount = $(topNodes[0].parentNode).contents().index(topNodes[0]);
        }
        var offsetToStart = preCaretTextRange.text.length + nodesBeforeFirstSelectedCount;
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
    },

    //Get valid HTML

    _validatorGet: function (body) {
        $(body).find('i').each(function () {
            var html = this.innerHTML;
            $(this).replaceWith($('<em></em>').html(html))
        });
    },

    //Public API

    addHTML: function (html) {
        var body = this.element.find('iframe').contents().find('body');
        body.empty().append(html);
    },

    html: function () {
        var body = this.element.find('iframe').contents().find('body').get(0);
        var bodyClone = body.cloneNode(true);
        this._validatorGet(bodyClone);
        return bodyClone.innerHTML;
    }

});