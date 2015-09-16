describe('Options', function() {
    var doctypeAsString = function (doctype) {
        return '<!DOCTYPE '
            + doctype.name
            + (doctype.publicId ? ' PUBLIC "' + doctype.publicId + '"' : '')
            + (!doctype.publicId && doctype.systemId ? ' SYSTEM' : '')
            + (doctype.systemId ? ' "' + doctype.systemId + '"' : '')
            + '>'
    };

    beforeEach(function(){
        $('#editor').remove();
        $('body').append('<div id="editor"></div>');
    });

    describe('width', function() {
        it('should work in %', function() {
            var editor = $('#editor').morrigan_editor({
                iframeStyles: '/base/css/iframe.css',
                width: '100%'
            });
            expect(editor.css('width')).toEqual($('body').css('width'));
        });

        it('should work in px', function() {
            var editor = $('#editor').morrigan_editor({
                iframeStyles: '/base/css/iframe.css',
                width: '250px'
            });
            expect(editor.css('width')).toEqual('250px');
        });
    });

    describe('height', function() {
        it('should work in px', function() {
            var editor = $('#editor').morrigan_editor({
                iframeStyles: '/base/css/iframe.css',
                height: '200px'
            });
            expect(editor.css('height')).toEqual('200px');
        });
    });

    describe('doctype', function() {
        it('should work', function() {
            var doctype = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
            $('#editor').morrigan_editor({
                iframeStyles: '/base/css/iframe.css',
                doctype: doctype
            });
            var doctypeString = doctypeAsString($('iframe.mrge-content-iframe').contents()[0].doctype);
            expect(doctypeString.toLowerCase()).toEqual(doctype.toLowerCase());
        });
    });

    describe('spell check', function() {
        it('should be on', function() {
            $('#editor').morrigan_editor({
                iframeStyles: '/base/css/iframe.css'
            });
            expect($('iframe.mrge-content-iframe').contents().find('body').attr('spellcheck')).toEqual(undefined);
        });

        it('should be off', function() {
            $('#editor').morrigan_editor({
                iframeStyles: '/base/css/iframe.css',
                spellCheck: false
            });
            expect($('iframe.mrge-content-iframe').contents().find('body').attr('spellcheck')).toEqual('false');
        });
    });

    describe('toolbox', function() {
        it('should be by default', function() {
            $('#editor').morrigan_editor({
                iframeStyles: '/base/css/iframe.css'
            });
            expect($('.mrge-action').size()).toEqual($('#editor').morrigan_editor('option', 'toolbox').toString().split(',').length);
        });

        it('should be with custom settings', function() {
            $('#editor').morrigan_editor({
                iframeStyles: '/base/css/iframe.css',
                toolbox: [
                    [
                        ['format', 'clearFormat'],
                        ['bold', 'italy', 'strike'],
                        ['img'],
                        ['alignLeft', 'alignCenter', 'alignRight']
                    ]
                ]
            });
            expect($('.mrge-action').size()).toEqual(9);
        });
    });
});