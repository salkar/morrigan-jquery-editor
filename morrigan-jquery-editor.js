$.widget( "morrigan.morrigan_editor", {

    options: {
        height: '300px',
        width: '700px',
        prefix: 'mrge',
        doctype: '<!DOCTYPE html>',
        iframeStyles: 'assets/morrigan_editor/iframe.css',
        toolbox: [
            [
                ['bold', 'italy']
            ],
            [
                ['strike']
            ]
        ]
    },

    _options: {
        rangeSelection: false,
        partOfEndElementSelected: false
    },

    browser: {
        opera: false,
        chrome: false,
        ie: false,
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
        else if (navigator.userAgent.indexOf('MSIE') != -1) this.browser.ie = true;
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
        var self = this;
        var config = this._getActionConfig(action_name);
        var id = this._generateActionId(action_name);
        $('#' + id).on("click", function () {
            config.onClickHandler(self);
        });
    },

    _generateActionId: function (action_name) {
        return this.options.prefix + '_' + action_name;
    },

    // Form toolbox

    _formToolbox: function() {
        var self = this;
        var toolbox_lines = "";
        $(this.options.toolbox).each(function () {
            toolbox_lines += self._formToolboxLine(this);
        });
        toolbox_lines += "<div class='clear'></div>";
        return "<div class='mrge-toolbox'>" + toolbox_lines + "</span>"
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
        result += " id='" + this.options.prefix + '_' + config.name + "'";
        if (config.view.icon) {
            result += " style='background: " + config['view']['icon'] + "'";
        }
        result += ">";
        if (config.view.text) {
            result += config['view']['text'];
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
        this.element.find('iframe').contents().find('body').on('keydown', function (e) {

                    self._keyDownHandler(e);

        }).on('keyup', function (e) {
//            console.log(e.target.innerHTML);
            self._keyUpHandler(e);
//            console.log(e.target.innerHTML);


         });
//            .on('focus', function (e) {
//        }).on('blur', function () {
//            })
    },

    _keyDownHandler: function (e) {
        if (!this.browser.ie && !this.browser.opera) {
            if (e.keyCode == 8) {
                var selection = this.element.find('iframe').get(0).contentWindow.getSelection();
                if (selection.focusNode.nodeName == 'P' &&
                    selection.focusNode.innerHTML == '<br>' &&
                    $(selection.focusNode).closest('body').children('p').length == 1)
                    e.preventDefault();
            }
        }
        if (this.browser.ff) {
            var selection = this.element.find('iframe').get(0).contentWindow.getSelection();
            if (!this._selectionIsCaret(selection)) {
                this._options.rangeSelection = true;
                if (selection.anchorNode.nodeType == 3) {
                    this._options.partOfEndElementSelected = true;
                }
            }
        }
    },

    _keyUpHandler: function (e) {
        if (!this.browser.ff) return;
        if (!this._options.rangeSelection) return;
        this._options.rangeSelection = false;
        var self = this;
        var contents = $(e.target).contents();
        var textnodes = contents.filter(function () {
            return this.nodeType === 3;
        });
        textnodes.each(function () {
            var element = $("<p>" + this.textContent + "</p>");
            console.log($(e.target).contents());
            $(this).replaceWith(element);
            $(e.target).children('br').remove();

            var selection = self.element.find('iframe').get(0).contentWindow.getSelection();
            var rng = self.element.find('iframe').get(0).contentWindow.document.createRange();
            console.log(self._options.partOfEndElementSelected)

            if (self._options.partOfEndElementSelected) {
                rng.setStart(element.get(0).firstChild, 0);
                self._options.partOfEndElementSelected = false;
            }
            else {
                rng.setStart(element.get(0).firstChild, element.text().length);
            }
            selection.removeAllRanges();
            selection.addRange(rng);
        });
        var brs = $(e.target).children('br');
        brs.each(function () {
            console.log(2)
            var element = $("<p><br></p>");
            $(this).replaceWith(element);
            var selection = self.element.find('iframe').get(0).contentWindow.getSelection();
            var rng = self.element.find('iframe').get(0).contentWindow.document.createRange();
            rng.setStart(element.get(0), 0);
            selection.removeAllRanges();
            selection.addRange(rng);
        })
    },

    // Support

    _getActionConfig: function (name) {
        return $.grep(this._actions, function (action) {
            return action["name"] == name;
        })[0];
    },

    _selectionIsCaret: function (selection) {
        if (selection.boundingWidth != undefined) return selection.boundingWidth == 0;
        return selection.anchorOffset == selection.focusOffset &&
            selection.anchorNode == selection.focusNode;
    }
});