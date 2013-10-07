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
    _currentActions: [],

    _actions: {
        img: {
            name: 'img',
            view: {
                disabledIcon: 'url(/disabled-actions.png) no-repeat no-repeat #eee -167px 2px',
                icon: '#CCCC99',
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
            selectionHandler: {
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
                icon: 'red',
                title: 'Italy'
            },
            onClickHandler: function (self, config) {
//                var actionId = self._generateActionId(config.name);
//                var isActive = self._actionIsActive(actionId);
//                self.element.find('iframe').get(0).contentWindow.document.execCommand('italic', false, null);
//                if (isActive) self._actionDeactivate(actionId, config);
//                else self._actionActivate(actionId, config);
            },
            selectionHandler: {
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
                icon: 'gray',
                title: 'Strike'
            },
            onClickHandler: function (self, config) {
//                var actionId = self._generateActionId(config.name);
//                var isActive = self._actionIsActive(actionId);
//                self.element.find('iframe').get(0).contentWindow.document.execCommand('strikethrough', false, null);
//                if (isActive) self._actionDeactivate(actionId, config);
//                else self._actionActivate(actionId, config);
            },
            selectionHandler: {
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
            selectionHandler: {
                onCaretSelectionChange: function (self, config, e) {
//                    var topNode = $(e.target).closest('body > *').get(0);
//                    if (topNode) {
//                        var topNodeName = $(e.target).closest('body > *').get(0).nodeName;
//                        var actionStatusText = self._configGetTextForNameFromActionList(config, topNodeName);
//                        var actionId = self._generateActionId(config.name);
//                        self._actionChangeDropDownCurrentState(actionId, actionStatusText);
//                    }

                },
                onRangeSelectionChange: function (self, config, e) {
//                    var selection = self._selectionGet();
//                    var topNodes = self._selectionGetSelectedTopNodes(selection);
//                    var topNodesName, differentTopNodes, actionStatusText;
//                    $(topNodes).each(function () {
//                        if (topNodesName) {
//                            if (topNodesName != this.nodeName) differentTopNodes = true;
//                            return;
//                        } else topNodesName = this.nodeName;
//                    });
//
//                    if (differentTopNodes) {
//                        actionStatusText = self._configGetDefaultText(config);
//                    } else {
//                        actionStatusText = self._configGetTextForNameFromActionList(config, topNodesName);
//                    }
//                    var actionId = self._generateActionId(config.name);
//                    self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                }
            },
            dropdown: {
                width: '150px',
                actionList: [
                    {
                        name: 'P',
                        text: 'Paragraph',
                        onClickHandler: function (self, config) {
//                            self._actionMutateTopSelectedNodes("P");
//                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'P');
//                            var actionId = self._generateActionId(config.name);
//                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                        }
                    },
                    {
                        name: 'H1',
                        text: 'Heading 1',
                        onClickHandler: function (self, config) {
//                            self._actionMutateTopSelectedNodes("H1");
//                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'H1');
//                            var actionId = self._generateActionId(config.name);
//                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                        }
                    },
                    {
                        name: 'H2',
                        text: 'Heading 2',
                        onClickHandler: function (self, config) {
//                            self._actionMutateTopSelectedNodes("H2");
//                            var actionStatusText = self._configGetTextForNameFromActionList(config, 'H2');
//                            var actionId = self._generateActionId(config.name);
//                            self._actionChangeDropDownCurrentState(actionId, actionStatusText);
                        }
                    },
                    {
                        name: 'H3',
                        text: 'Heading 3',
                        onClickHandler: function (self, config) {
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
        this.addAction = function (config, item) {
            var action = new this.editor.Action(config, item);
            this.actions.push(action);
            if (!action.enabled) this.disabledActions.push(this.actions.length - 1);
        }
    },

    Action: function (config, element) {
        this.element = element;
        this.config = config;
        this.enabled = false;

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
                if (config.view.text) item.text(config.view.text).addClass('mrge-action-text');
                item.addClass('mrge-disabled mrge-action');
                if (config.dropdown) {
                    item.addClass('mrge-action-list');
                    dropdown = $('<div class="mrge-action-dropdown" style="display: none;"></div>');
                    if (config.dropdown.width) dropdown.width(config.dropdown.width);
                    $(config.dropdown.actionList).each(function () {
                        dropdownItem = $('<div></div>').attr('id', editor.options.idPrefix + this.name).text(this.text);
                        dropdown.append(dropdownItem);
                    });
                    item.append(dropdown);
                }
                if (editor._browser.ie) {
                    item.attr('unselectable', 'on');
                    item.find('*').attr('unselectable', 'on');
                }
                editor._actionManager.addAction(config, item);
                item.attr('id', editor.options.idPrefix + (editor._currentActions.length-1));
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
                if (editor._browser.ie || editor._browser.opera) return "<p></p>";
                else return "<p><br></p>";
            };

            setupIframe = function (iframe) {
                var idoc = iframe.get(0).contentWindow.document;
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
//        this.editor = editor;
//        this.exec = function () {
//            var actions = editor.options.toolbox
//        }
    },

    EditorError: function (editor) {
        this.editor = editor;
        this.exec = function (msg) {
            editor.element.text(msg);
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
        return true;
    },

    _build: function () {
        this._actionManager = new this.ActionManager(this);
        (new this.Builder(this)).exec();
    },

    _create: function () {
        if (!this._prepare()) return;
        this._build();
//        console.log(this._actionManager.actions);
//        console.log(this._actionManager.disabledActions);
        //(new this.EventBinder(this)).exec();
        //this._currentActions[0].actionEnable();
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