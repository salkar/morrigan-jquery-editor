$.widget( "morrigan.morrigan_editor", {

    options: {
        height: '300px',
        width: '700px',
        idPrefix: 'mrge_',
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

    _browser: {},

    _actions: {
        img: {
            name: 'img',
            view: {
                disabledIcon: 'orange',
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
                disabledIcon: 'orange',
                activeIcon: '#3366CC',
                icon: 'black',
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
                disabledIcon: 'orange',
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
                disabledIcon: 'orange',
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

    Browser: function () {
        this.list = {
            opera:null,
            ff:null,
            ie:null,
            chrome:null
        };

        var agent = navigator.userAgent;
        if (agent.indexOf('Opera') != -1) this.list.opera = true;
        else if (agent.indexOf('Chrome') != -1) this.list.chrome = true;
        else if (agent.indexOf('Firefox') != -1) this.list.ff = true;
        else if (agent.indexOf('MSIE') != -1) {
            if (agent.indexOf('MSIE 8') != -1) this.list.ie = 8;
            else if (agent.indexOf('MSIE 7') != -1) this.list.ie = 7;
            else this.list.ie = true;
        }
    },

    Builder: function (editor) {
        this.editor = editor;
        this.exec = function () {
            this._setupMainElement();
            this._buildToolbox();
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
                item.addClass('mrge-disabled').attr('id', editor.options.idPrefix + config.name);
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
        }
    },

    _create: function() {
        this._browser = (new this.Browser()).list;
        (new this.Builder(this)).exec();
    }

});