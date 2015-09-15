describe("myFunction", function() {
    $('body').append('<div id="editor"></div>');
    var editor = $('#editor').morrigan_editor({
        iframeStyles: '/base/css/iframe.css'
    });

    //beforeEach(function(){
    //    spyOn(myfunc, 'init').andCallThrough();
    //});
    //
    //afterEach(function() {
    //    myfunc.reset();
    //});

    it("first test", function() {
        console.log(111);
    });

    //it("should populate stuff during initialization", function(){
    //    myfunc.init();
    //    expect(myfunc.stuff.length).toEqual(1);
    //    expect(myfunc.stuff[0]).toEqual('Testing');
    //});
    //will insert additional tests here later
});