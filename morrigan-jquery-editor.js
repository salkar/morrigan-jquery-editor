$.widget( "morrigan.morrigan_editor", {

    options: {
        height: '600px',
        width: '900px',
        doctype: '<!DOCTYPE html>',
        notSupportedMsg: 'Your browser is not supported.',
        iframeStyles: '/iframe.css',
        imageUpload: null,
        spellCheck: true,
        toolbox: [
            [
                ['format'],
                ['bold', 'italy', 'strike'],
                ['img', 'video'],
                ['alignLeft', 'alignCenter', 'alignRight'],
                ['orderedList', 'unorderedList'],
                ['link', 'unLink']
            ]
        ],
        popup: {
            actions: {
                ok:{
                    caption:'Ok'
                },
                cancel:{
                    caption:'Cancel'
                }
            }
        },
        block: {
            mediaBlock: {
                width: {
                    def:'350px',
                    max:'400px'
                },
                height: {
                    def:'270px',
                    max:'430px',
                    video: '205px'
                }
            }
        }
    },

    _browser: {},
    _content: null,
    _window: null,
    _actionManager: null,
    _selectionManager: null,
    _actionSupport: null,
    _popup: null,
    _uploader: null,
    _loader: null,
    _blockManager: null,
    _options: {},

    _actions: {
        video: {
            name: 'video',
            view: {
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                title: 'Video',
                classes: 'fa fa-youtube-play'
            },
            popup: {
                title: 'Add video',
                height: '130px',
                html: '<form action="/video/create" method="post" enctype="multipart/form-data" target="mrge-support-iframe">' +
                    '<div class="mrge-option"><input type="text" placeholder=" add video HTML code here" name="video_html"></div></form>',
                actions: ['ok', 'cancel'],
                onShow: function (element, editor) {
                    var savedTextRange;
                    isIframeCodeCorrect = function (code) {
                        return /^<iframe.* src=\".*><\/iframe>\s*$/.test(code);
                    };

                    exec = function () {
                        var iframeCode = element.find('input[name="video_html"]').val();
                        if (isIframeCodeCorrect(iframeCode)) {
                            if (editor._browser.ie) editor._selectionManager.restoreInternalRange(savedTextRange);
                            editor._blockManager.addBlock({videoHTML:iframeCode});
                            editor._popup.hidePopup();
                        } else {
                            alert('Video HTML is not correct');
                        }
                    };

                    element.find('.mrge-popup-ok').on('click', function () {
                        exec();
                    });

                    if (editor._browser.ie) {
                        savedTextRange = editor._selectionManager.getInternalRange();
                    }
                },
                onHide:function (element) {
                    element.find('.mrge-popup-ok').off('click');
                }
            }
        },
        img: {
            name: 'img',
            view: {
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                title: 'Image',
                classes: 'fa fa-picture-o'
            },
            popup: {
                title: 'Add image',
                height: '200px',
                actions: ['ok', 'cancel'],
                customForm: function (editor, container) {
                    var html = '<form action="' + editor.options.imageUpload + '" method="post" enctype="multipart/form-data" target="mrge-support-iframe">' +
                               '<div class="mrge-option"><input type="file" name="upload_img"/></div><div class="mrge-divider">or</div>' +
                               '<div class="mrge-option"><input type="text" placeholder=" add image link here" name="upload_url"></div></form>';
                    container.html($(html));
                },
                onShow: function (element, editor) {
                    var savedTextRange;
                    haveFileToUpload = function () {
                        var input_file = element.find('[name="upload_img"]');
                        var url_string = element.find('[name="upload_url"]');
                        return input_file.val() != '' || url_string.val() != '';
                    };
                    uploadImage = function () {
                        var imgUrl;
                        editor._uploader.prepareToLoad();
                        element.find('form').submit();
                        editor._loader.showLoader();
                        var timerId = setInterval(function () {
                            imgUrl = editor._uploader.getData();
                            if (imgUrl) {
                                clearInterval(timerId);
                                editor._loader.hideLoader();
                                if (editor._browser.ie) editor._selectionManager.restoreInternalRange(savedTextRange);
                                editor._blockManager.addBlock({imageUrl:imgUrl['data']});
                            }
                        }, 100);
                    };
                    exec = function () {
                        if (haveFileToUpload()) {
                            editor._popup.hidePopup();
                            uploadImage();
                        }
                    };
                    element.find('input[type="file"]').on('change', function () {
                        exec();
                    });
                    element.find('.mrge-popup-ok').on('click', function () {
                        exec();
                    });
                    if (editor._browser.ie) {
                        savedTextRange = editor._selectionManager.getInternalRange();
                    }
                },
                onHide:function (element) {
                    element.find('.mrge-popup-ok').off('click');
                }
            }
        },
        alignLeft: {
            name: 'alignLeft',
            view: {
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                title: 'Align Left',
                classes: 'fa fa-align-left'
            },
            onClickHandler: function (editor, action) {
                var cSelection = editor._selectionManager.getCustomSelection();
                var isCaret = editor._selectionManager.isCaret(cSelection);
                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                var topElementsWithoutBlocks = $(topElements).filter(function () {
                    return this.nodeName != 'DIV';
                });
                $(topElementsWithoutBlocks).css('text-align', '');
                editor._content.trigger('mouseup'); //TODO: make radio group without trig selectionChangeHandler
            },
            selectionHandler: function (editor, data, e) {
                var topElements = data.topElements;
                var firstPAlign = $(topElements).first().css('text-align');
                var topElementsWithoutBlocks = $(topElements).filter(function () {
                    return this.nodeName != 'DIV';
                });
                var correctTopElements = $(topElementsWithoutBlocks).filter(function () {
                    return $(this).css('text-align') == firstPAlign;
                });
                this.changeActiveIcon(topElementsWithoutBlocks.length == correctTopElements.length &&
                    (firstPAlign == 'left' || firstPAlign =='start'));
            }
        },
        alignCenter: {
            name: 'alignCenter',
            view: {
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                title: 'Align Center',
                classes: 'fa fa-align-center'
            },
            onClickHandler: function (editor, action) {
                var cSelection = editor._selectionManager.getCustomSelection();
                var isCaret = editor._selectionManager.isCaret(cSelection);
                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                var firstPAlign = $(topElements).first().css('text-align');
                var topElementsWithoutBlocks = $(topElements).filter(function () {
                    return this.nodeName != 'DIV';
                });
                var correctTopElements = $(topElementsWithoutBlocks).filter(function () {
                    return $(this).css('text-align') == firstPAlign;
                });
                if (topElementsWithoutBlocks.length == correctTopElements.length && firstPAlign == 'center') {
                    $(topElementsWithoutBlocks).css('text-align', '');
                } else {
                    $(topElementsWithoutBlocks).css('text-align', 'center');
                }
                editor._content.trigger('mouseup'); //TODO: make radio group without trig selectionChangeHandler
            },
            selectionHandler: function (editor, data, e) {
                var topElements = data.topElements;
                var firstPAlign = $(topElements).first().css('text-align');
                var topElementsWithoutBlocks = $(topElements).filter(function () {
                    return this.nodeName != 'DIV';
                });
                var correctTopElements = $(topElementsWithoutBlocks).filter(function () {
                    return $(this).css('text-align') == firstPAlign;
                });
                this.changeActiveIcon(topElementsWithoutBlocks.length == correctTopElements.length && firstPAlign == 'center');
            }
        },
        alignRight: {
            name: 'alignRight',
            view: {
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                title: 'Align Right',
                classes: 'fa fa-align-right'
            },
            onClickHandler: function (editor, action) {
                var cSelection = editor._selectionManager.getCustomSelection();
                var isCaret = editor._selectionManager.isCaret(cSelection);
                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                var firstPAlign = $(topElements).first().css('text-align');
                var topElementsWithoutBlocks = $(topElements).filter(function () {
                    return this.nodeName != 'DIV';
                });
                var correctTopElements = $(topElementsWithoutBlocks).filter(function () {
                    return $(this).css('text-align') == firstPAlign;
                });
                if (topElementsWithoutBlocks.length == correctTopElements.length && firstPAlign == 'right') {
                    $(topElementsWithoutBlocks).css('text-align', '');
                } else {
                    $(topElementsWithoutBlocks).css('text-align', 'right');
                }
                editor._content.trigger('mouseup'); //TODO: make radio group without trig selectionChangeHandler
            },
            selectionHandler: function (editor, data, e) {
                var topElements = data.topElements;
                var firstPAlign = $(topElements).first().css('text-align');
                var topElementsWithoutBlocks = $(topElements).filter(function () {
                    return this.nodeName != 'DIV';
                });
                var correctTopElements = $(topElementsWithoutBlocks).filter(function () {
                    return $(this).css('text-align') == firstPAlign;
                });
                this.changeActiveIcon(topElementsWithoutBlocks.length == correctTopElements.length && firstPAlign == 'right');
            }
        },

        orderedList: {
            name: 'orderedList',
            view: {
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                title: 'Ordered List',
                classes: 'fa fa-list-ol'
            },
            onClickHandler: function (editor, action) {
                editor._window.document.execCommand('InsertOrderedList', false, null);
                action.changeActiveIcon(editor._window.document.queryCommandState('InsertOrderedList'));
                editor._actionManager.findAction('unorderedList').changeActiveIcon(editor._window.document.queryCommandState('InsertUnorderedList'));
                var cSelection = editor._selectionManager.getCustomSelection();
                var isCaret = editor._selectionManager.isCaret(cSelection);
                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                $(topElements[0]).find('ol').unwrap();
            },
            selectionHandler: function (editor, data, e) {
                this.changeActiveIcon(editor._window.document.queryCommandState('InsertOrderedList'));
            }
        },

        unorderedList: {
            name: 'unorderedList',
            view: {
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                title: 'Unordered List',
                classes: 'fa fa-list-ul'
            },
            onClickHandler: function (editor, action) {
                editor._window.document.execCommand('InsertUnorderedList', false, null);
                action.changeActiveIcon(editor._window.document.queryCommandState('InsertUnorderedList'));
                editor._actionManager.findAction('orderedList').changeActiveIcon(editor._window.document.queryCommandState('InsertOrderedList'));
                var cSelection = editor._selectionManager.getCustomSelection();
                var isCaret = editor._selectionManager.isCaret(cSelection);
                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                $(topElements[0]).find('ul').unwrap();
            },
            selectionHandler: function (editor, data, e) {
                this.changeActiveIcon(editor._window.document.queryCommandState('InsertUnorderedList'));
            }
        },

        bold: {
            name: 'bold',
            view: {
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                title: 'Bold',
                classes: 'fa fa-bold'
            },
            onClickHandler: function (editor, action) {
                editor._window.document.execCommand('bold', false, null);
                action.changeActiveIcon(editor._window.document.queryCommandState('bold'));
            },
            selectionHandler: function (editor, data, e) {
                this.changeActiveIcon(editor._window.document.queryCommandState('bold'));
            }
        },
        italy: {
            name: 'italy',
            view: {
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                title: 'Italy',
                classes: 'fa fa-italic'
            },
            onClickHandler: function (editor, action) {
                editor._window.document.execCommand('italic', false, null);
                action.changeActiveIcon(editor._window.document.queryCommandState('italic'));
            },
            selectionHandler: function (editor, data, e) {
                this.changeActiveIcon(editor._window.document.queryCommandState('italic'));
            }
        },
        strike: {
            name: 'strike',
            view: {
                title: 'Strike',
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                classes: 'fa fa-strikethrough'
            },
            onClickHandler: function (editor, action) {
                editor._window.document.execCommand('strikethrough', false, null);
                action.changeActiveIcon(editor._window.document.queryCommandState('strikethrough'));
            },
            selectionHandler: function (editor, data, e) {
                this.changeActiveIcon(editor._window.document.queryCommandState('strikethrough'));
            }
        },
        unLink: {
            name: 'unLink',
            view: {
                title: 'Unlink',
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                classes: 'fa fa-unlink'
            },
            onClickHandler: function (editor, action) {
                editor._window.document.execCommand('Unlink', false, null);
            }
        },
        link: {
            name: 'link',
            view: {
                activeBackground: '#aaa',
                inactiveBackground: '#eee',
                title: 'Link',
                classes: 'fa fa-link'
            },
            popup: {
                title: 'Add link',
                height: '130px',
                html: '<div class="mrge-option"><input type="text" placeholder=" URL" name="url"></div>',
                actions: ['ok', 'cancel'],
                onShow: function (element, editor) {
                    var prepareHref = function(linkUrl) {
                      if (linkUrl.indexOf('http') == 0) {
                          return linkUrl;
                      } else {
                          return 'http://' + linkUrl;
                      }
                    };
                    var savedTextRange;
                    exec = function () {
                        var linkUrl = prepareHref(element.find('input[name="url"]').val());
                        if (editor._browser.ie) editor._selectionManager.restoreInternalRange(savedTextRange);

                        editor._window.document.execCommand('CreateLink', false, linkUrl);
                        editor._popup.hidePopup();
                    };

                    element.find('.mrge-popup-ok').on('click', function () {
                        exec();
                    });

                    if (editor._browser.ie) {
                        savedTextRange = editor._selectionManager.getInternalRange();
                    }
                },
                onHide: function (element) {
                    element.find('.mrge-popup-ok').off('click');
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
                    var resultItemIndex = this.config.dropdown.matchList[resultTagName];
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
                var resultTagName, firstElementTag, correctTopElements;
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
            },
            dropdown: {
                width: '150px',
                actionList: [
                    {
                        text: 'Paragraph',
                        tag: 'P',
                        onClickHandler: function (editor, action) {
                            if (editor._browser.webkit) {
                                var cSelection = editor._selectionManager.getCustomSelection();
                                var isCaret = editor._selectionManager.isCaret(cSelection);
                                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                                editor._actionSupport.mutateBlock(topElements, 'P', cSelection);
                            } else {
                                editor._window.document.execCommand("formatblock", false, "<p>");
                            }

                            action.changeStatus('P');
                        }
                    },
                    {
                        text: 'Heading 1',
                        tag: 'H2',
                        onClickHandler: function (editor, action) {
                            if (editor._browser.webkit) {
                                var cSelection = editor._selectionManager.getCustomSelection();
                                var isCaret = editor._selectionManager.isCaret(cSelection);
                                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                                editor._actionSupport.mutateBlock(topElements, 'H2', cSelection);
                            } else {
                                editor._window.document.execCommand("formatblock", false, "<h2>");
                            }
                            action.changeStatus('H2');
                        }
                    },
                    {
                        text: 'Heading 2',
                        tag: 'H3',
                        onClickHandler: function (editor, action) {
                            if (editor._browser.webkit) {
                                var cSelection = editor._selectionManager.getCustomSelection();
                                var isCaret = editor._selectionManager.isCaret(cSelection);
                                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                                editor._actionSupport.mutateBlock(topElements, 'H3', cSelection);
                            } else {
                                editor._window.document.execCommand("formatblock", false, "<h3>");
                            }
                            action.changeStatus('H3');
                        }
                    },
                    {
                        text: 'Heading 3',
                        tag: 'H4',
                        onClickHandler: function (editor, action) {
                            if (editor._browser.webkit) {
                                var cSelection = editor._selectionManager.getCustomSelection();
                                var isCaret = editor._selectionManager.isCaret(cSelection);
                                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                                editor._actionSupport.mutateBlock(topElements, 'H4', cSelection);
                            } else {
                                editor._window.document.execCommand("formatblock", false, "<h4>");
                            }
                            action.changeStatus('H4');
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
        this.findAction = function (name) {
            return $.grep(this.actions, function (action) {
                return action.config.name == name;
            })[0];
        };
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
        if (config.view.activeBackground && config.view.inactiveBackground) {
            this.activeState = false;
            this.changeActiveIcon = function (isActive) {
                if (isActive == undefined) {
                    if (this.activeState) {
                        this.setInactiveIcon();
                    } else {
                        this.setActiveIcon();
                    }
                } else {
                    if (isActive && !this.activeState) this.setActiveIcon();
                    else if (!isActive && this.activeState) this.setInactiveIcon();
                }

            };
            this.setActiveIcon = function () {
                this.element.css('background-color', config.view.activeBackground).addClass('mrge-active');
                this.activeState = true;
            };
            this.setInactiveIcon = function () {
                this.element.css('background-color', config.view.inactiveBackground).removeClass('mrge-active');
                this.activeState = false;
            };
        }
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
        } else {
            this.onClickHandler = config.onClickHandler;
        }
        this.selectionHandler = this.config.selectionHandler;
    },

    ActionSupport: function (editor) {
        this.editor = editor;
        this.mutateBlock = function (topNodes, nodeName, cSelection) {
            var savedSelection = this._saveSelection(cSelection);
            var mutated = false;
            $(topNodes).each(function () {
                if (this.nodeName != nodeName) {
                    $(this).replaceWith("<" + nodeName + ">" + this.innerHTML + "</" + nodeName + ">");
                    mutated = true;
                }
            });
            if (mutated) this._restoreSelection(savedSelection);
        };
        this._saveSelection = function (cSelection) {
            var selection = cSelection.selection;
            var anchorNodePath = this._getNodePath(selection.anchorNode);
            var focusNodePath = this._getNodePath(selection.focusNode);
            if (this._isCorrectSequenceSelection(selection)) {
                return {
                    anchorNodePath: anchorNodePath,
                    anchorOffset: selection.anchorOffset,
                    focusNodePath: focusNodePath,
                    focusOffset: selection.focusOffset
                };
            } else {
                return {
                    anchorNodePath: focusNodePath,
                    anchorOffset: selection.focusOffset,
                    focusNodePath: anchorNodePath,
                    focusOffset: selection.anchorOffset
                };
            }
        };
        this._isCorrectSequenceSelection = function (selection) {
            var rng = this.editor._window.document.createRange();
            rng.setStart(selection.anchorNode, selection.anchorOffset);
            rng.setEnd(selection.focusNode, selection.focusOffset);
            return rng.startOffset == selection.anchorOffset && rng.startContainer == selection.anchorNode;
        };
        this._restoreSelection = function (savedSelection) {
            var anchorNode = this._getNodeFromPath(savedSelection.anchorNodePath);
            var focusNode = this._getNodeFromPath(savedSelection.focusNodePath);

            var selection = this.editor._window.getSelection();
            var rng = this.editor._window.document.createRange();

            rng.setStart(anchorNode, savedSelection.anchorOffset);
            rng.setEnd(focusNode, savedSelection.focusOffset);
            selection.removeAllRanges();
            selection.addRange(rng);
        };
        this._getNodeFromPath = function (path) {
            var currentNode = this.editor._content;
            while (path.length != 0) {
                var currentChildIndex = path.pop();
                currentNode = currentNode.contents().eq(currentChildIndex);
            }
            return currentNode.get(0);
        };
        this._getNodePath = function (node) {
            var result = [];
            var currentNode = node;
            while (currentNode.nodeName != 'BODY') {
                result.push($(currentNode.parentNode).contents().index(currentNode));
                currentNode = currentNode.parentNode;
            }
            return result;
        };
        this.addParamToUrl = function (url, param, value) {
            return url + (url.split('?')[1] ? '&':'?') + param + '=' + value;
        }
    },

    BlockManager: function (editor) {
        this.element = null;
        this.current_block = null;

        this._bindEvents = function () {
            var self = this;
            editor._content.on('dragstart', 'img', function (e) {
                e.preventDefault();
                return false;
            }).on('mouseenter', '.mrge-content-block', function (e) {
                self.showBlockManager(this);
            }).on('mouseleave', '.mrge-content-block', function (e) {
                self.hideBlockManager(this);
            }).on('click', '.mrge-content-block-top', function(e) {
                self._moveUp();
            }).on('click', '.mrge-content-block-bottom', function(e) {
                self._moveDown();
            }).on('click', '.mrge-content-block-close', function (e) {
                self.removeBlock();
            });
        };

        this._bindEvents();

        this.showBlockManager = function (block) {
            this.current_block = block;
            $(block).append('<div class="mrge-content-block-top mrge-content-block-move-action mrge-temp-support-element" contenteditable="false">▲</div>');
            $(block).append('<div class="mrge-content-block-bottom mrge-content-block-move-action mrge-temp-support-element" contenteditable="false">▼</div>');
            $(block).append('<div class="mrge-content-block-close mrge-temp-support-element fa fa-close" contenteditable="false">×</div>');
        };

        this._moveUp = function () {
            var newBlock;
            var self = this;
            var prevElements = this._getElementsNearCurrentBlock(true);
            var prevElement = this._getNearElementForCurrentBlock(prevElements, true);
            if (prevElement.length) {
                var prevBlock = this._getNearBlock(prevElements, true);
                if (prevBlock && this._needToGoToBlock(prevBlock, prevElement, true)) {
                    newBlock = this._insertBlockRelative(this.current_block, prevBlock, true);
                } else {
                    newBlock = this._insertBlockRelative(this.current_block, prevElement, true);
                }
            }
            editor._selectionManager.clearSelection();
        };

        this._needToGoToBlock = function (nearBlock, nearElement, before) {
            if (before) {
                var blockBottomCoord = nearBlock.offset().top + nearBlock.outerHeight(true);
                var curBlockTopCoord = $(this.current_block).offset().top - nearElement.outerHeight(true);
                return blockBottomCoord >= curBlockTopCoord;
            } else {
                var blockTopCoord = nearBlock.offset().top;
                var curBlockBottomCoord = $(this.current_block).offset().top + $(this.current_block).outerHeight(true);
                return blockTopCoord <= curBlockBottomCoord;
            }
        };

        this._needToGoFromBlocks = function (prevBlock) {
            var prevBlockBottomCoord = prevBlock.offset().top + prevBlock.outerHeight(true);
            var curBlockTopCoord = $(this.current_block).offset().top;
            return prevBlockBottomCoord >= curBlockTopCoord;
        };

        this._getTargetToMoveFromBlocks = function (prevBlock) {
            var prevBlockBottomCoord = prevBlock.offset().top + prevBlock.outerHeight(true);
            var currentParagraph = prevBlock.next();
            while (currentParagraph.length > 0) {
                if (currentParagraph[0].nodeName == 'P' && currentParagraph.offset().top + currentParagraph.outerHeight(true) > prevBlockBottomCoord) return currentParagraph;
                currentParagraph = currentParagraph.next();
            }
            return null;
        };

        this._insertBlockRelative = function (current_element, element, before) {
            var blockClone = $(current_element).clone();
            editor._selectionManager.clearSelection();
            $(current_element).remove();
            if (before) blockClone.insertBefore(element);
            else blockClone.insertAfter(element);
            return blockClone;
        };

        this._getNearBlock = function (elements, before) {
            var blockSideClass = $(this.current_block).hasClass('mrge-left-side') ? 'mrge-left-side' : 'mrge-right-side';
            var blocks = $.grep(elements, function (item) {
                return $(item).hasClass('mrge-content-block') && $(item).hasClass(blockSideClass);
            });
            if (blocks.length > 0) {
                if (before) return $(blocks).last();
                else return $(blocks).first();
            }
            else return null;
        };

        this._getNearElementForCurrentBlock = function (elements, before) {
            if (before) return $(elements).last();
            else return $(elements).first();
        };

        this._getElementsNearCurrentBlock = function (before) {
            var targetChildren;
            var children = editor._content.children();
            var curIndex = $(this.current_block).index();
            if (before) targetChildren = children.slice(0, curIndex);
            else targetChildren = children.slice(curIndex+1, children.length);
            return $.grep(targetChildren, function (item) {
                return !$(item).hasClass('mrge-support-element');
            });
        };

        this._moveDown = function () {
            var newBlock;
            var self = this;
            var nextElements = this._getElementsNearCurrentBlock(false);
            var nextElement = this._getNearElementForCurrentBlock(nextElements, false);
            if (nextElement.length) {
                var nextBlock = this._getNearBlock(nextElements, false);
                if (nextBlock && this._needToGoToBlock(nextBlock, nextElement, false)) {
                    nextBlock = this._insertBlockRelative(nextBlock, this.current_block, true);
                    newBlock = this._insertBlockRelative(this.current_block, nextBlock, false);
                } else {
                    var prevElements = this._getElementsNearCurrentBlock(true);
                    var prevBlock = this._getNearBlock(prevElements, true);
                    if (prevBlock && this._needToGoFromBlocks(prevBlock)) {
                        var targetP = this._getTargetToMoveFromBlocks(prevBlock);
                        if (targetP) newBlock = this._insertBlockRelative(this.current_block, targetP, false);
                        else return;
                    } else {
                        newBlock = this._insertBlockRelative(this.current_block, nextElement, false);
                    }
                }
            }
            editor._selectionManager.clearSelection();
        };

        this.hideBlockManager = function () {
            editor._content.find('.mrge-temp-support-element').remove();
        };

        this.addBlock = function (data) {
            var cSelection = editor._selectionManager.getCustomSelection();
            var isCaret = editor._selectionManager.isCaret(cSelection);
            var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
            var block = new editor.Block(editor, topElements[0], data);
        };

        this.removeBlock = function () {
            $(this.current_block).detach();
            this.hideBlockManager();
        };
    },

    Block: function (editor, topNode, data) {
        this.editor = editor;
        this.element = this._formSelf(data);
        if (topNode === undefined) {
            var node = $('<p><br /></p>');
            node.appendTo(editor._content);
            this.element.insertBefore(node);
        } else {
            this.element.insertBefore(topNode);
        }
    },

    _blockMethodsInitialize: function (editor) {
        this.Block.prototype._formSelf = function (data) {
            var dataResult, result;
            if (data['imageUrl']) {
                dataResult = $('<img src="' + data['imageUrl'] + '">');
                dataResult.css('max-width', this.editor.options.block.mediaBlock.width.def);
                dataResult.css('max-height', this.editor.options.block.mediaBlock.height.def);
            } else if (data['videoHTML']) {
                dataResult = $(data['videoHTML']);
                dataResult.attr('src', editor._actionSupport.addParamToUrl(dataResult.attr('src'), 'wmode', 'opaque'));
                dataResult.width(this.editor.options.block.mediaBlock.width.video || this.editor.options.block.mediaBlock.width.def);
                dataResult.height(this.editor.options.block.mediaBlock.height.video);
                dataResult.attr('wmode', 'Opaque');
                dataResult.attr('frameborder', '0');
            }
            result = $('<div class="mrge-content-block mrge-left-side" contenteditable="false"><div class="mrge-content-block-item"></div></div>');
            var defWidth = this.editor.options.block.mediaBlock.width.def;
            var defHeight = this.editor.options.block.mediaBlock.height.def;
            result.css('max-width', defWidth);
            result.css('max-height', defHeight);
            result.children().css('max-width', defWidth);
            result.children().css('max-height', defHeight);
            result.children().append(dataResult);
            return result;
        };
    },

    Builder: function (editor) {
        this.editor = editor;
        this.exec = function () {
            this._setupMainElement();
            this._buildToolbox();
            this._buildContentField();
            this._buildSupportElements();
        };
        this._setupMainElement = function () {
            editor.element.width(editor.options.width).height(editor.options.height).addClass('morrigan-editor');
        };
        this._buildToolbox = function () {
            _formToolboxItem = function (config) {
                var dropdown, dropdownItem;
                var item = $('<a></a>');
                if (config.view.title) item.attr('title', config.view.title);
                if (config.view.classes) item.addClass(config.view.classes);
                if (config.view.disabledIcon) item.css("background", config.view.disabledIcon);
                if (config.view.text) item.append($('<span></span>').text(config.view.text).addClass('mrge-action-text'));
                item.addClass('mrge-disabled mrge-action mrge-action-' + config.name);
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
                else if (editor._browser.ff || editor._browser.webkit) return "";
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
                setTimeout(function () {
                    editor._content.height(iframeBodyHeight(iframe));
                }, 100);

                if (!editor.options.spellCheck) editor._content.attr('spellcheck', false);
            };

            var contentField = $("<div class='mrge-content' style='height: " + contentFieldHeight() + "px'><iframe frameborder='0' class='mrge-content-iframe'></iframe></div>");
            editor.element.append(contentField);
            setupIframe(contentField.find('iframe'));
        };

        this._buildSupportElements = function () {
            editor.element.append("<div class='mrge-support-elements'></div>");
        }
    },

    EventBinder: function (editor) {
        this.keyCodesAffectedDomChanges = [8,13,33,34,35,36,37,38,39,40,46];
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
                window.setTimeout(function () {self._defaultBehaviorMouseEvent(e)}, 10);
            });
        };

        this._defaultBehaviorMouseEvent = function (e) {
            var cSelection = editor._selectionManager.getCustomSelection();
            var isCaret = editor._selectionManager.isCaret(cSelection);
            var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
            this._onSelectionChangedHandlers(e, topElements, isCaret);
        };

        this._defaultBehaviorKeyUpHandler = function (e) {
            if (editor._browser.ff || editor._browser.webkit || $.inArray(e.keyCode, this.keyCodesAffectedDomChanges) != -1) {
                var cSelection = editor._selectionManager.getCustomSelection();
                var isCaret = editor._selectionManager.isCaret(cSelection);
                var topElements = editor._selectionManager.getTopSelectedElements(cSelection, isCaret);
                if (!topElements[0] || topElements[0].nodeType == 3 || topElements[0].nodeName == 'DIV') {
                    editor._window.document.execCommand("formatBlock", false, "p");
                }
                if (topElements[0].nodeType === 3) return;
                this._onSelectionChangedHandlers(e, topElements, isCaret);
            }
        };

        this._onSelectionChangedHandlers = function (e, topElements, isCaret) {
            $(editor._actionManager.selectionChangedSubscribers).each(function () {
                (editor._actionManager.actions[this]).selectionHandler(editor, {topElements:topElements, isCaret:isCaret}, e);
            });
        };

        this._defaultBehaviorKeyDownHandler = function (e) {
        };

        this.bindCustomEvents = function () {
            var self = this;
            $(editor._actionManager.actions).each(function () {
                if (this.config.dropdown) {
                    self._bindEventsToDropDown(this);
                } else if (this.config.popup) {
                    self._bindEventsToPopupAction(this);
                } else {
                    self._bindEventsToSimpleAction(this);
                }
            });
        };

        this._bindEventsToPopupAction = function (action) {
            action.element.on('click', function () {
                if (action.enabled) {
                    editor._popup.showPopup(action);
                }
            });
        };

        this._bindEventsToSimpleAction = function (action) {
            action.element.on('click', function () {
                if (action.enabled) {
                    action.onClickHandler(editor, action);
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

    Popup: function (editor) {
        this.editor = editor;
        this.currentAction = null;
        this.element = null;
        this._formSelf = function () {
            var result = $("<div class='mrge-popup-wrapper'>" +
                        "<div class='mrge-popup-overlay'></div></div>");
            var popup = $("<div class='mrge-popup'><div class='mrge-popup-header'><div class='mrge-popup-box-wrapper'><span class='mrge-header-name'></span><div class='mrge-popup-close fa fa-times'></div></div>" +
                "<div class='mrge-clear'></div></div><div class='mrge-popup-content'><div class='mrge-popup-box-wrapper'></div></div>");
            var actionContainer = $("<div class='mrge-popup-actions'><div class='mrge-popup-box-wrapper'></div></div>");
            $.each(editor.options.popup.actions, function (key, value) {
                var action = $("<div class='mrge-popup-" + key + " mrge-popup-btn'>" + this.caption + "</div>");
                this.element = action;
                actionContainer.children('.mrge-popup-box-wrapper').append(action);
            });
            actionContainer.children('.mrge-popup-box-wrapper').append('<div class="mrge-clear"></div>');
            popup.append(actionContainer);
            result.append(popup);
            editor.element.append(result);
            this.element = result;
        };

        this._bindMainEvents = function () {
            var self = this;
            this.element.on('click', '.mrge-popup-close', function () {
                self.hidePopup();
            }).on('click', '.mrge-popup-cancel', function () {
                self.hidePopup();
            });
        };

        this._formSelf();
        this._bindMainEvents();

        this._bindCustomEvents = function (action) {
            action.config.popup.onShow(this.element, this.editor);
        };

        this._unbindCustomEvents = function (action) {
            if (action.config.popup.onHide) action.config.popup.onHide(this.element);
        };

        this.showPopup = function (action) {
            this.currentAction = action;
            this._configure(action.config.popup);
            this._bindCustomEvents(action);
            this._locateAndShow();
        };
        this.hidePopup = function () {
            this._unbindCustomEvents(this.currentAction);
            this.currentAction = null;
            this.element.hide();
        };
        this._configure = function (config) {
            this.element.find('.mrge-header-name').text(config.title);
            this.element.find('.mrge-popup').height(config.height);
            var container = this.element.find('.mrge-popup-content .mrge-popup-box-wrapper');
            container.empty();
            if (config.customForm) {
                config.customForm(editor, container);
            } else {
                container.append(config.html);
            }
            this.element.find('.mrge-popup-actions .mrge-popup-btn.mrge-active').removeClass('mrge-active');
            $.each(config.actions, function () {
                editor.options.popup.actions[this].element.addClass('mrge-active');
            });
        };
        this._locateAndShow = function () {
            var popup = this.element.find('.mrge-popup');
            var y = editor.element.height() / 2 - popup.height() / 2;
            var x = editor.element.width() / 2 - popup.width() / 2;
            y = (y < 0 ? 0 : y);
            x = (x < 0 ? 0 : x);
            popup.css('top', y);
            popup.css('left', x);
            this.element.show();
        };
    },

    Uploader: function (editor) {
        this.editor = editor;
        this.element = null;
        this._formSelf = function () {
            var result = $("<iframe class='mrge-support-iframe' name='mrge-support-iframe'></iframe>");
            editor.element.children('.mrge-support-elements').append(result);
            this.element = result;
        };
        this.prepareToLoad = function () {
            this.element.contents().empty();
        };

        this.getData = function () {
            return (this.element.contents().find('body').text() ? JSON.parse(this.element.contents().find('body').text()) : null);
        };

        this._formSelf();
    },

    Loader: function (editor) {
        this.editor = editor;
        this.element = null;
        this._formSelf = function () {
            var result = $("<div class='mrge-loader-wrapper'><div class='mrge-loader-background'></div><div class='mrge-loader-icon fa fa-spinner fa-spin'></div></div>");
            editor.element.append(result);
            this.element = result;
        };

        this._formSelf();

        this.showLoader = function () {
            this.element.addClass('active');
        };

        this.hideLoader = function () {
            this.element.removeClass('active');
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

        this.getInternalRange = function () {
            var sel;
            if (editor._window.getSelection) {
                sel = editor._window.getSelection();
                if (sel.rangeCount) {
                    return sel.getRangeAt(0);
                }
            } else if (editor._window.document.selection) {
                return editor._window.document.selection.createRange();
            }
            return null;
        };

        this.restoreInternalRange = function (range) {
//            if (textRange != null) textRange.select();
            if (range != null) {
                if (range.select) {
                    range.select();
                } else {
                    var sel = editor._window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        };

//        this._textRangeEmpty = function (textRange) {
//            return textRange.boundingHeight == 0 && textRange.boundingWidth == 0;
//        };

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
            var selection, startElement, endElement, result;
            if (cSelection.selection) {
                selection = cSelection.selection;
                if (selection.anchorNode === null) return [];
                startElement = this._getPreBodyNode(selection.anchorNode);
                if (startElement === null) return [];
                if (isCaret) return [startElement];
                endElement = this._getPreBodyNode(selection.focusNode);
                result = (($(startElement).position().top < $(endElement).position().top) ?
                    this._getElementBetween(startElement, endElement)
                    :
                    this._getElementBetween(endElement, startElement));
            } else {
                result = this._ie8GetTopSelectedElements(cSelection.range);
            }
            return $.grep(result, function (item) {
                return item.nodeName != 'DIV'
            });
        };

        this._ie8GetTopSelectedElements = function (range) {
            var iframeBody = editor._content;
            var iframeScrollTop = editor.element.find('iframe').contents().find('html')[0].scrollTop;
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
        };

        this._getPreBodyNode = function (node) {
            if (node.nodeName == 'BODY') return null;
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

        this.clearSelection = function () {
            var sel;
            if (editor._window.getSelection) {
                sel = editor._window.getSelection();
                sel.removeAllRanges();
            } else {
                editor._window.document.selection.empty();
            }
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
        this._blockMethodsInitialize(this);
        return true;
    },

    _createSupportObjects: function () {
        this._actionManager = new this.ActionManager(this);
        this._selectionManager = new this.SelectionManager(this);
        this._actionSupport = new this.ActionSupport(this);
    },

    _createSupportObjectsAfterBuildHTML: function () {
        this._popup = new this.Popup(this);
        this._uploader = new this.Uploader(this);
        this._loader = new this.Loader(this);
        this._blockManager = new this.BlockManager(this);
    },

    _buildHTML: function () {
        (new this.Builder(this)).exec();
    },

    _bindEvents: function () {
        var eventBinder = new this.EventBinder(this);
        eventBinder.bindDefaultEvents();
        eventBinder.bindCustomEvents();
    },

    _setupForBrowser: function () {
        if (this._browser.ie) {
            $.each(this.element.find('*'), function () {
                $(this).attr('unselectable', 'on');
            });
        }
    },

    _create: function () {
        if (!this._prepare()) return;
        this._createSupportObjects();
        this._buildHTML();
        this._createSupportObjectsAfterBuildHTML();
        this._bindEvents();
        this._setupForBrowser();
    },

    // Public API
    html: function (html) {
        if (html) {
            var children = this._content.children();
            children.detach();
//            $($.grep(children, function (item) {
//                return !$(item).hasClass('mrge-support-element');
//            })).detach();
            return this._content.append(html).get(0);
        } else {
            var targetHtml;
            var contentClone = this._content.clone();
            contentClone.find('.mrge-temp-support-element').remove();
            contentClone.find('br').remove();
            contentClone.find('b').each(function () {
                targetHtml = this.innerHTML;
                $(this).replaceWith($('<strong></strong>').html(targetHtml))
            });
            contentClone.find('i').each(function () {
                targetHtml = this.innerHTML;
                $(this).replaceWith($('<em></em>').html(targetHtml))
            });
            return contentClone.html();
        }
    }

});