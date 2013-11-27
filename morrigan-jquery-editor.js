$.widget( "morrigan.morrigan_editor", {

    options: {
        height: '300px',
        width: '700px',
        idPrefix: 'mrge_',
        doctype: '<!DOCTYPE html>',
        notSupportedMsg: 'Your browser is not supported.',
        iframeStyles: '/iframe.css',
        toolbox: [
            [
                ['bold', 'italy', 'strike'], ['img']
            ],
            [
                ['format']
            ]
        ]
    },

    _browser: {},
    _content: null,
    _window: null,
    _actionManager: null,
    _selectionManager: null,
    _options: {},

    _actions: {
        img: {
            name: 'img',
            view: {
                disabledIcon: 'url(/disabled-actions.png) no-repeat no-repeat #eee -167px 2px',
                icon: 'url(/actions.png) no-repeat no-repeat #eee -167px 2px',
                title: 'Image'
            },
            popup: {
                html: '<form action="/image/create" method="post" id="mrge-img-form-ok" enctype="multipart/form-data" target="mrge-support-iframe"><input type="file" name="upload_img"/></form>',
                onClickHandler: function (self, config, e) {
//                    var imgUrl;
//                    self._loaderPrepare();
//                    $('#mrge-img-form-ok').submit();
//                    self._popupHide();
//                    var timerId = setInterval(function () {
//                        imgUrl = self._loaderGetData();
//                        if (imgUrl) {
//                            clearInterval(timerId);
//                            self._actionInsertImg(imgUrl['data']);
//                        }
//                    }, 100);

                }
            }
        },
        bold: {
            name: 'bold',
            view: {
                disabledIcon: 'url(/disabled-actions.png) no-repeat no-repeat #eee 2px 2px',
                activeIcon: '#3366CC',
                icon: 'url(/actions.png) no-repeat no-repeat #eee 2px 2px',
                title: 'Bold'
            },
            onClickHandler: function (self, config, e) {
//                var actionId = self._generateActionId(config.name);
//                var isActive = self._actionIsActive(actionId);
//                self.element.find('iframe').get(0).contentWindow.document.execCommand('bold', false, null);
//                if (isActive) self._actionDeactivate(actionId, config);
//                else self._actionActivate(actionId, config);
            },
            selectionHandler1: {
                onSelectionChange: function (self, config, e) {
//                    var actionId = self._generateActionId(config.name);
//                    var isActive = self._actionIsActive(actionId);
//                    if (self.element.find('iframe').get(0).contentWindow.document.queryCommandState('bold')) {
//                        if (!isActive) self._actionActivate(actionId, config);
//                    } else {
//                        if (isActive) self._actionDeactivate(actionId, config);
//                    }
                }
            }
        },
        italy: {
            name: 'italy',
            view: {
                disabledIcon: 'url(/disabled-actions.png) no-repeat no-repeat #eee -18px 2px',
                activeIcon: 'green',
                icon: 'url(/actions.png) no-repeat no-repeat #eee -18px 2px',
                title: 'Italy'
            },
            onClickHandler: function (self, config) {
//                var actionId = self._generateActionId(config.name);
//                var isActive = self._actionIsActive(actionId);
//                self.element.find('iframe').get(0).contentWindow.document.execCommand('italic', false, null);
//                if (isActive) self._actionDeactivate(actionId, config);
//                else self._actionActivate(actionId, config);
            },
            selectionHandler1: {
                onSelectionChange: function (self, config, e) {
//                    var actionId = self._generateActionId(config.name);
//                    var isActive = self._actionIsActive(actionId);
//                    if (self.element.find('iframe').get(0).contentWindow.document.queryCommandState('italic')) {
//                        if (!isActive) self._actionActivate(actionId, config);
//                    } else {
//                        if (isActive) self._actionDeactivate(actionId, config);
//                    }
                }
            }
        },
        strike: {
            name: 'strike',
            view: {
                disabledIcon: 'url(/disabled-actions.png) no-repeat no-repeat #eee -39px 2px',
                activeIcon: "#66FF00",
                icon: 'url(/actions.png) no-repeat no-repeat #eee -39px 2px',
                title: 'Strike'
            },
            onClickHandler: function (self, config) {
//                var actionId = self._generateActionId(config.name);
//                var isActive = self._actionIsActive(actionId);
//                self.element.find('iframe').get(0).contentWindow.document.execCommand('strikethrough', false, null);
//                if (isActive) self._actionDeactivate(actionId, config);
//                else self._actionActivate(actionId, config);
            },
            selectionHandler1: {
                onSelectionChange: function (self, config, e) {
//                    var actionId = self._generateActionId(config.name);
//                    var isActive = self._actionIsActive(actionId);
//                    if (self.element.find('iframe').get(0).contentWindow.document.queryCommandState('strikethrough')) {
//                        if (!isActive) self._actionActivate(actionId, config);
//                    } else {
//                        if (isActive) self._actionDeactivate(actionId, config);
//                    }
                }
            }
        },
        format: {
            name: 'format',
            view: {
                text: 'Format',
                title: 'Paragraph format'
            },
            changeStatus: function (resultTagName) {
                if (resultTagName) {
                    resultItemIndex = this.config.dropdown.matchList[resultTagName];
                    if (!isNaN(resultItemIndex) && this.config.dropdown.currentActionItemIndex != resultItemIndex) {
                        this.config.dropdown.currentActionItemIndex = resultItemIndex;
                        $(this.element).children('span.mrge-action-text').text(this.config.dropdown.actionList[resultItemIndex].text);
                    } else if (isNaN(resultItemIndex) && this.config.dropdown.currentActionItemIndex != 0) {
                        this.config.dropdown.currentActionItemIndex = 0;
                        $(this.element).children('span.mrge-action-text').text(this.config.dropdown.actionList[0].text);
                    }
                } else {
                    if (this.config.dropdown.currentActionItemIndex != -1) {
                        this.config.dropdown.currentActionItemIndex = -1;
                        $(this.element).children('span.mrge-action-text').text(this.config.view.text);
                    }
                }
            },
            selectionHandler: function (editor, data, e) {
                var resultTagName, firstElementTag, correctTopElements, resultItemIndex;
                var topElements = data.topElements;
                if (topElements.length > 0 && topElements[0]) {
                    firstElementTag = topElements[0].nodeName;
                    correctTopElements = $(topElements).filter(function () {
                        return this.nodeName === firstElementTag;
                    });
                    if (correctTopElements.length == topElements.length) resultTagName = firstElementTag;
                } else {
                    resultTagName = 'P';
                }

                this.changeStatus(resultTagName);

//                console.log(firstElementTag);
//                console.log(this.config.dropdown.matchList);

//                onCaretSelectionChange: function (self, config, e) {
////                    var topNode = $(e.target).closest('body > *').get(0);
////                    if (topNode) {
////                        var topNodeName = $(e.target).closest('body > *').get(0).nodeName;
////                        var actionStatusText = self._configGetTextForNameFromActionList(config, topNodeName);
////                        var actionId = self._generateActionId(config.name);
////                        self._actionChangeDropDownCurrentState(actionId, actionStatusText);
////                    }
//
//                },
//                onRangeSelectionChange: function (self, config, e) {
////                    var selection = self._selectionGet();
////                    var topNodes = self._selectionGetSelectedTopNodes(selection);
////                    var topNodesName, differentTopNodes, actionStatusText;
////                    $(topNodes).each(function () {
////                        if (topNodesName) {
////                            if (topNodesName != this.nodeName) differentTopNodes = true;
////                            return;
////                        } else topNodesName = this.nodeName;
////                    });
////
////                    if (differentTopNodes) {
////                        actionStatusText = self._configGetDefaultText(config);
////                    } else {
////                        actionStatusText = self._configGetTextForNameFromActionList(config, topNodesName);
////                    }
////                    var actionId = self._generateActionId(config.name);
////                    self._actionChangeDropDownCurrentState(actionId, actionStatusText);
//                },
//                onSelectionChange: function (editor, data, e) {
                    console.log('selection change handler');
//                }
            },
            dropdown: {
                width: '150px',
                actionList: [
                    {
                        text: 'Paragraph',
                        tag: 'P',
                        onClickHandler: function (editor, action) {
                            editor._window.document.execCommand("formatblock", false, "<p>");
                            action.changeStatus('P');
//                            self._actionMutateTopSelectedNodes("P");
//                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'P');
//                            var actionId = self._generateActionId(config.name);
//                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                        }
                    },
                    {
                        text: 'Heading 1',
                        tag: 'H2',
                        onClickHandler: function (editor, action) {
                            editor._window.document.execCommand("formatblock", false, "<h2>");
                            action.changeStatus('H2');
//                            self._actionMutateTopSelectedNodes("H1");
//                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'H1');
//                            var actionId = self._generateActionId(config.name);
//                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                        }
                    },
                    {
                        text: 'Heading 2',
                        tag: 'H3',
                        onClickHandler: function (editor, action) {
                            editor._window.document.execCommand("formatblock", false, "<h3>");
                            action.changeStatus('H3');
//                            self._actionMutateTopSelectedNodes("H2");
//                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'H2');
//                            var actionId = self._generateActionId(config.name);
//                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                        }
                    },
                    {
                        text: 'Heading 3',
                        tag: 'H4',
                        onClickHandler: function (editor, action) {
                            editor._window.document.execCommand("formatblock", false, "<h4>");
                            action.changeStatus('H4');
//                            self._actionMutateTopSelectedNodes("H3");
//                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'H3');
//                            var actionId = self._generateActionId(config.name);
//                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                        }
                    }
                ]
            }
        }

    },

    // Classes

    ActionManager: function (editor) {
        this.editor = editor;
        this.actions = [];
        this.disabledActions = [];
        this.selectionChangedSubscribers = [];
        this.addAction = function (config, item) {
            var action = new this.editor.Action(config, item);
            this.actions.push(action);
            var actionIndex = this.actions.length - 1;
            if (!action.enabled) this.disabledActions.push(actionIndex);
            if (action.selectionHandler) this.selectionChangedSubscribers.push(actionIndex);
        }
    },

    Action: function (config, element) {
        var self = this;
        this.element = element;
        this.config = config;
        this.enabled = false;
        this.changeStatus = config.changeStatus;
        if (this.config.dropdown) {
            this.config.dropdown.shown = false;
            this.config.dropdown.currentActionItemIndex = -1;
            this.dropDownShow = function () {
                this.element.children('.mrge-action-dropdown').show();
                this.config.dropdown.shown = true;
            };
            this.dropDownHide = function () {
                this.config.dropdown.shown = false;
                this.element.children('.mrge-action-dropdown').hide();
            };
            this.config.dropdown.matchList = {};
            $(this.config.dropdown.actionList).each(function (i) {
                self.config.dropdown.matchList[this.tag] = i;
            });
        }
        this.selectionHandler = this.config.selectionHandler;
    },

    Builder: function (editor) {
        this.editor = editor;
        this.exec = function () {
            this._setupMainElement();
            this._buildToolbox();
            this._buildContentField();
        };
        this._setupMainElement = function () {
            editor.element.width(editor.options.width).height(editor.options.height).addClass('morrigan-editor');
        };
        this._buildToolbox = function () {
            _formToolboxItem = function (config) {
                var dropdown, dropdownItem;
                var item = $('<a></a>');
                if (config.view.title) item.attr('title', config.view.title);
                if (config.view.disabledIcon) item.css("background", config.view.disabledIcon);
                if (config.view.text) item.append($('<span></span>').text(config.view.text).addClass('mrge-action-text'));
                item.addClass('mrge-disabled mrge-action');
                if (config.dropdown) {
                    item.addClass('mrge-action-list');
                    dropdown = $('<div class="mrge-action-dropdown" style="display: none;"></div>');
                    if (config.dropdown.width) dropdown.width(config.dropdown.width);
                    $(config.dropdown.actionList).each(function () {
                        dropdownItem = $('<div></div>').text(this.text);
                        this.element = dropdownItem;
                        dropdown.append(dropdownItem);
                    });
                    item.append(dropdown);
                }
                if (editor._browser.ie) {
                    item.attr('unselectable', 'on');
                    item.find('*').attr('unselectable', 'on');
                }
                editor._actionManager.addAction(config, item);
                item.attr('id', editor.options.idPrefix + (editor._actionManager.actions.length-1));
                return item;
            };

            _formToolboxBlock = function (arr) {
                var blockItems = $('<li></li>');
                $(arr).each(function () {
                    blockItems.append(_formToolboxItem(editor._actions[this]));
                });
                return blockItems;
            };

            _formToolboxLine = function (arr) {
                var toolboxLines = $('<ul></ul>');
                $(arr).each(function () {
                    toolboxLines.append(_formToolboxBlock(this));
                });
                return toolboxLines;
            };

            formToolbox = function () {
                var toolbox = $('<div class="mrge-toolbox"></div>');
                $(editor.options.toolbox).each(function () {
                    toolbox.append(_formToolboxLine(this));
                });
                toolbox.append($('<div class="mrge-clear"></div>'));
                return toolbox;
            };

            editor.element.append(formToolbox());
        };

        this._buildContentField = function () {
            contentFieldHeight = function () {
                var toolboxHeight = editor.element.find('.mrge-toolbox').outerHeight(true);
                return editor.element.height() - toolboxHeight;
            };
            iframeBodyHeight = function (iframe) {
                var body = iframe.contents().find('body');
                var diff = body.outerHeight(true) - body.height();
                return iframe.height() - diff
            };
            defaultContentFieldContent = function () {
                if (editor._browser.ie) return "<p></p>";
                else if (editor._browser.ff) return "";
                else return "<p><br></p>";
            };

            setupIframe = function (iframe) {
                editor._window = iframe.get(0).contentWindow;
                var idoc = editor._window.document;
                idoc.open();
                idoc.write(editor.options.doctype);
                idoc.write("<html style='cursor: text;height: 100%;'>");
                idoc.write("<head><link href='" + editor.options.iframeStyles + "' media='all' rel='stylesheet' type='text/css'></head>");
                idoc.write("<body contenteditable='true' class='mrge-iframe-body'>" + defaultContentFieldContent() + "</body></html>");
                idoc.close();
                editor._content = iframe.contents().find('body');
                editor._content.height(iframeBodyHeight(iframe));
            };

            var contentField = $("<div class='mrge-content' style='height: " + contentFieldHeight() + "px'><iframe frameborder='0' class='mrge-content-iframe'></iframe></div>");
            editor.element.append(contentField);
            setupIframe(contentField.find('iframe'));
        };
    },

    EventBinder: function (editor) {
        this.editor = editor;
        this.bindDefaultEvents = function () {
            this._defaultActivateWidgetsEvent();
            this._defaultBehaviorEvents();
        };

        this._defaultActivateWidgetsEvent = function () {
            editor.element.find('iframe').contents().find('body').on("focus", function () {
                var actionManager = editor._actionManager;
                var actionsToEnable = actionManager.disabledActions.slice();
                $.each(actionsToEnable, function (i, val) {
                    actionManager.enableAction(val);
                })
            });
        };

        this._defaultBehaviorEvents = function () {
            var self = this;
            editor._content.on('keydown',function (e) {
                self._defaultBehaviorKeyDownHandler(e);
            }).on('keyup', function (e) {
                self._defaultBehaviorKeyUpHandler(e);
            }).on('mouseup', function (e) {
                self._defaultBehaviorMouseEvent(e);
            }).on('click', function (e) {
                self._defaultBehaviorMouseEvent(e);
            });
        };

        this._defaultBehaviorMouseEvent = function (e) {
            var cSelection = editor._selectionManager.getCustomSelection();
            console.log(cSelection);
            var isCaret = editor._selectionManager.isCaret(cSelection);
            console.log(isCaret);
            var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
            this._onSelectionChangedHandlers(e, topElements, isCaret);
        };

        this._defaultBehaviorKeyUpHandler = function (e) {
            if (editor._browser.ff) {
                var cSelection = editor._selectionManager.getCustomSelection();
                var isCaret = editor._selectionManager.isCaret(cSelection);
                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                if (!topElements[0] || topElements[0].nodeType == 3) {
                    editor._window.document.execCommand("formatBlock", false, "p");
                }
                this._onSelectionChangedHandlers(e, topElements, isCaret);
            }
        };

        this._onSelectionChangedHandlers = function (e, topElements, isCaret) {
            $(editor._actionManager.selectionChangedSubscribers).each(function () {
                (editor._actionManager.actions[this]).selectionHandler(editor, {topElements:topElements, isCaret:isCaret}, e);
            });
        };

        this._defaultBehaviorKeyDownHandler = function (e) {
            if (editor._browser.webkit) {
                var cSelection = editor._selectionManager.getCustomSelection();
                if (e.keyCode == 8) {
                    if (editor._selectionManager.isLastEmptyPTagSelected(cSelection)) {
                        e.preventDefault();
                    }
                }
            }
        };

        this.bindCustomEvents = function () {
            var self = this;
            $(editor._actionManager.actions).each(function () {
                if (this.config.dropdown) {
                    self._bindEventsToDropDown(this);
                }
            });
        };

        this._bindEventsToDropDown = function (action) {
            var self = this;
            action.element.on('click', function () {
                if (action.enabled) {
                    if (action.config.dropdown.shown) {
                        action.dropDownHide();
                    } else {
                        action.dropDownShow();
                    }
                }
            });

            $(action.config.dropdown.actionList).each(function () {
                self._bindEventsToDropDownAction(this, action);
            });

        };

        this._bindEventsToDropDownAction = function (dropdownAction, action) {
            dropdownAction.element.on('click', function () {
                dropdownAction.onClickHandler(editor, action);
            });
        };
    },

    EditorError: function (editor) {
        this.editor = editor;
        this.exec = function (msg) {
            editor.element.text(msg);
        }
    },

    SelectionManager: function (editor) {
        this.editor = editor;

        this.getCustomSelection = function () {
            var cSelection = {};
            var window = this.editor._window;
            if (window.getSelection) {
                cSelection.selection = window.getSelection();
            } else {
                cSelection.range = window.document.selection.createRange();
            }
            return cSelection;
        };

        this.isLastEmptyPTagSelected = function (cSelection) {
            var selection = cSelection.selection;
            return this.isCaret(cSelection) &&
                selection.focusNode.nodeName == 'P' &&
                selection.focusNode.innerHTML == '<br>' &&
                $(selection.focusNode).closest('body').children('p').length == 1;
        };

        this.isCaret = function (cSelection) {
            if (cSelection.range) {
                return cSelection.range.boundingWidth == 0;
            } else {
                var selection = cSelection.selection;
                return selection.anchorOffset == selection.focusOffset &&
                    selection.anchorNode == selection.focusNode;
            }
        };

        this.getTopSelectedElements = function (cSelection, isCaret) {
            var selection, startElement, endElement;
            if (cSelection.selection) {
                selection = cSelection.selection;
                startElement = this._getPreBodyNode(selection.anchorNode);
                if (isCaret) return [startElement];
                endElement = this._getPreBodyNode(selection.focusNode);
                return ($(startElement).position().top < $(endElement).position().top) ?
                    this._getElementBetween(startElement, endElement)
                    :
                    this._getElementBetween(endElement, startElement);
            }
        };

        this._getPreBodyNode = function (node) {
            return (node.parentNode.nodeName == 'BODY' ? node : $(node).closest('body > *').get(0));
        };

        this._getElementBetween = function (startElement, endElement) {
            var curElement, result;
            curElement = startElement;
            result = [];
            while (curElement != endElement) {
                result.push(curElement);
                curElement = curElement.nextSibling;
            }
            result.push(endElement);
            return result;
        };
    },

    _actionManagerMethodInitialize: function () {
        this.ActionManager.prototype.enableAction = function (i) {
            var action = this.actions[i];
            action.actionEnable();
            var indexToRemove = $.inArray(i, this.disabledActions);
            if (indexToRemove != -1) this.disabledActions.splice(indexToRemove, 1);
        }
    },

    _actionMethodsInitialize: function () {
        this.Action.prototype.actionEnable = function () {
            this.element.removeClass('mrge-disabled');
            $(this.element).css("background", this.config.view.icon);
            this.enabled = true;
        }
    },

    _getBrowser: function () {
        var list = {};
        var agent = navigator.userAgent;
        if (agent.indexOf('WebKit') != -1) list.webkit = true;
        else if (agent.indexOf('Firefox') != -1) list.ff = true;
        else if (agent.indexOf('MSIE') != -1) {
            if (/MSIE\s([\d.]+)/.test(navigator.userAgent)) {
                var version = parseInt(RegExp.$1);
                if (version == 8) list.ie = 8;
                else if (version > 8) list.ie = true;
            }
        }
        else if (agent.indexOf('Trident')) list.ie = true;
        if (!(list.ie || list.ff || list.webkit)) list.nonSupported = true;
        return list;
    },

    _prepare: function () {
        this._browser = this._getBrowser();
        if (this._browser.nonSupported) {
            (new this.EditorError(this)).exec(this.options.notSupportedMsg);
            return false;
        }
        this._actionMethodsInitialize();
        this._actionManagerMethodInitialize();
        return true;
    },

    _createSupportObjects: function () {
        this._actionManager = new this.ActionManager(this);
        this._selectionManager = new this.SelectionManager(this);
    },

    _buildHTML: function () {
        (new this.Builder(this)).exec();
    },

    _bindEvents: function () {
        var eventBinder = new this.EventBinder(this);
        eventBinder.bindDefaultEvents();
        eventBinder.bindCustomEvents();
    },

    _create: function () {
        if (!this._prepare()) return;
        this._createSupportObjects();
        this._buildHTML();
        this._bindEvents();
//        console.log(this._actionManager.actions);
//        console.log(this._actionManager.disabledActions);
    },

    // Public API
    html: function (html) {
        if (html) {
            return this._content.empty().append(html).get(0);
        } else {
            return this._content.get(0);
        }
    }

});