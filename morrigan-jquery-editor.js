$.widget( "morrigan.morrigan_editor", {

    options: {
        height: '300px',
        width: '700px',
        prefix: 'mrge',
        toolbox: [
            [
                ['bold']
            ]
        ]
    },

    actions: [
        {
            name: 'bold',
            view: {
                icon: 'black',
                title: 'bold'
            },
            onClickHandler: function (self) {
                console.log(self.options.height)
            }
        }
    ],
 
    _create: function() {
        this._setupMainElement();

        var toolbox = this._formToolbox();
        this.element.append(toolbox);

        this._bindEvents();
    },

    // Setup main element

    _setupMainElement: function () {
        this.element.width(this.options.width).height(this.options.height).addClass('morrigan-editor');
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
        return "<span class='mrge-toolbox'>" + toolbox_lines + "</span>"
    },

    _formToolboxLine: function(arr) {
        var self = this;
        var toolbox_line = "";
        $(arr).each(function () {
            toolbox_line += self._formToolboxBlock(this);
        });
        return toolbox_line;
    },

    _formToolboxBlock: function (arr) {
        var self = this;
        var block_items = "";
        $(arr).each(function () {
            block_items += self._formToolboxItem(this);
        });
        return "<span class='mrge-toolbox-block'>" + block_items + "</span>";
    },

    _formToolboxItem: function (name) {
        var config = this._getActionConfig(name);
        var result = "<span class='mrge-toolbox-action' title='" + config['view']['title'] + "'";
        result += " id='" + this.options.prefix + '_' + config.name + "'";
        if (config.view.icon) {
            result += " style='background: " + config['view']['icon'] + "'";
        }
        result += ">";
        if (config.view.text) {
            result += config['view']['text'];
        }
        return result + "</span>";
    },

    _getActionConfig: function (name) {
        return $.grep(this.actions, function (action) { return action["name"] == name})[0];
    }
 
});