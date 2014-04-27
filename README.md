# Morrigan jQuery Editor
WYSIWYG jQuery Morrigan Editor created with predictable behavior, persistence and consistency ideas.

[Demo](http://morrigan-editor.org/)
## To install Morrigan Editor:
* Get [jQuery](http://jquery.com/download/) and [jQuery UI](http://jqueryui.com/download/#!version=1.10.4&themeParams=none&components=1111111110000000000000000000000000) (UI Core + Interactions)
* Get [Font Awesome](http://fortawesome.github.io/Font-Awesome/get-started/)
* Get [morrigan-jquery-editor.js](https://github.com/salkar/morrigan-jquery-editor/blob/master/morrigan-jquery-editor.js), [morrigan-jquery-editor.css](https://github.com/salkar/morrigan-jquery-editor/blob/master/css/morrigan-jquery-editor.css) and [iframe.css](https://github.com/salkar/morrigan-jquery-editor/blob/master/css/iframe.css)
* Code:
```javascript
$(function() {
  $('#editor').morrigan_editor( {
    iframeStyles: '/iframe.css',
    width:'770px',
    height:'550px'
  } );
});
```
