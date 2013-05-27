$.widget( "morrigan.morrigan_editor", {

    options: {
        height: '300px',
        width: '700px'
    },
 
    _create: function() {
        this.element.width(this.options.width);
        this.element.height(this.options.height);

    }
 
});