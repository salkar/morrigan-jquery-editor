$.widget( "morrigan.morrigan_editor", {

    options: {
        height: '300px',
        width: '700px',
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
                icon: '..',
                title: 'bold'
            }
        }
    ],
 
    _create: function() {
        this.element.width(this.options.width);
        this.element.height(this.options.height);
        this.element.addClass('morrigan-editor');
        var toolbox = this._formToolbox();
        console.log(toolbox);
    },

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
        console.log(this._getActionConfig(name));
        return name
    },

    _getActionConfig: function (name) {
        return $.grep(this.actions, function (action) { return action["name"] == name})[0];
    }
 
});