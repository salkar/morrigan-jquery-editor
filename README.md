# Morrigan jQuery Editor
Morrigan Editor is jQuery WYSIWYG editor with predictable behavior, persistence and consistency.

[Demo](http://morrigan-editor.org/)
## To install Morrigan Editor:
You can install Morrigan Editor manually or by gem if you are using Ruby on Rails (installation manual for RoR is available [here](https://github.com/salkar/morrigan_editor_rails)).
* Get [jQuery](http://jquery.com/download/) and [jQuery UI](http://jqueryui.com/download/#!version=1.10.4&themeParams=none&components=1111111110000000000000000000000000) (UI Core + Interactions)
* Get [Font Awesome](http://fortawesome.github.io/Font-Awesome/get-started/)
* Get [morrigan-jquery-editor.js](https://github.com/salkar/morrigan-jquery-editor/blob/master/morrigan-jquery-editor.js), [morrigan-jquery-editor.css](https://github.com/salkar/morrigan-jquery-editor/blob/master/css/morrigan-jquery-editor.css) and [iframe.css](https://github.com/salkar/morrigan-jquery-editor/blob/master/css/iframe.css)
* Code:
```javascript
$(function() {
  editor = $('#editor').morrigan_editor( {
    iframeStyles: '/iframe.css',
    imageUpload:'/image/create',
    width:'770px',
    height:'550px'
  } );
});
```

### For Image Upload

Pass param ```imageUpload``` to init options:
```javascript
  $('#editor').morrigan_editor( {
    //...
    imageUpload:'/image/create',
    //...
  } );
```

Params sending to server sample:
* ```upload_img``` (with image) for file uploading
* ```upload_url``` (with url) for image uploading by URL

Server response sample (for both cases):
```javascript
  {data: "/url/to/image.jpeg"}
```

## How to use

To get html from editor:
```javascript
  editor.morrigan_editor('html');
```

To insert html to editor:
```javascript
  editor.morrigan_editor('html', '<p>Your HTML</p>');
```

## Tests
For run tests move to `tests` folder and do next:
1. npm install
2. http-server -p 80 -a localhost
