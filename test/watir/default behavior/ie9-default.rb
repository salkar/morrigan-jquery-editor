require 'watir-webdriver'
require 'rspec'
require 'rubygems'

describe "IE default container behavior" do

  before :all do
    @b = Watir::Browser.new :ie
  end

	before :each do
		@b.goto 'http://192.168.56.101:3000/single_test'
		@iframe = @b.frame :index => 0
	end
	
	it "There is a default <p> tag in contenteditable body should be" do
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).html.should == "<p></p>"
	end
	
	it "Content should be put in the default <p>" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aaaaa"
		@iframe.p(:index => 1).text.should == "bbbbb"
	end
	
	it "First p tag should not be removed" do
		@iframe.click
		@iframe.send_keys 'a'
		@iframe.send_keys :enter
		@iframe.send_keys 'b'
		@iframe.ps.size.should == 2
		@iframe.send_keys :backspace
		@iframe.ps.size.should == 2
		@iframe.send_keys :backspace
		@iframe.ps.size.should == 1
		@iframe.send_keys :backspace
		@iframe.ps.size.should == 1
		(0..3).each { @iframe.send_keys :backspace }
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).html.should == "<p></p>"
	end
	
	it "First P tag should be left when selection deleted by backspace" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.ps.size.should == 1
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(a.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).html.should == "<p></p>"
		
		@iframe.send_keys :backspace
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).html.should == "<p></p>"
	end
	
	it "All text should be in P tag when selection deleted by backspace (middle of first p and middle of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aabbb"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aasbbb"
	end
	
	it "All text should be in P tag when selection deleted by backspace (middle of first p and start of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aabbbbb"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aasbbbbb"
	end
	
	it "All text should be in P tag when selection deleted by backspace (middle of first p and end of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aa"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aas"
	end
	
	it "All text should be in P tag when selection deleted by backspace (start of first p and middle of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "bbb"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "sbbb"
	end
	
	it "All text should be in P tag when selection deleted by backspace (start of first p and end of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == ""
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "s"
	end
	
	it "All text should be in P tag when selection deleted by backspace (start of first p and start of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "bbbbb"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "sbbbbb"
	end
	
	it "All text should be in P tag when selection deleted by backspace (end of first p and start of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aaaaabbbbb"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aaaaasbbbbb"
	end
	
	it "All text should be in P tag when selection deleted by backspace (end of first p and middle of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aaaaabbb"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aaaaasbbb"
	end
	
	it "All text should be in P tag when selection deleted by backspace (end of first p and end of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aaaaa"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aaaaas"
	end
	
	it "All text should be in P tag when selection deleted by backspace (middle of first p and middle of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aabbb"
		@iframe.p(:index => 1).text.should == "ccccc"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aasbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by backspace (middle of first p and start of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aabbbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aasbbbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by backspace (middle of first p and end of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aa"
		@iframe.p(:index => 1).text.should == "ccccc"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aas"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by backspace (start of first p and middle of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "bbb"
		@iframe.p(:index => 1).text.should == "ccccc"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "sbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by backspace (start of first p and end of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == ""
		@iframe.p(:index => 1).text.should == "ccccc"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "s"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by backspace (start of first p and start of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "bbbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "sbbbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by backspace (end of first p and start of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aaaaabbbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aaaaasbbbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by backspace (end of first p and middle of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aaaaabbb"
		@iframe.p(:index => 1).text.should == "ccccc"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aaaaasbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by backspace (end of first p and end of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		@iframe.send_keys :backspace
		
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aaaaa"
		@iframe.p(:index => 1).text.should == "ccccc"
		
		@iframe.send_keys "s"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aaaaas"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by key (middle of first p and middle of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aasdbbb"
	end
	
	it "All text should be in P tag when selection deleted by key (middle of first p and start of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aasdbbbbb"
	end
	
	it "All text should be in P tag when selection deleted by key (middle of first p and end of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aasd"
	end
	
	it "All text should be in P tag when selection deleted by key (start of first p and middle of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "sdbbb"
	end
	
	it "All text should be in P tag when selection deleted by key (start of first p and end of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "sd"
	end
	
	it "All text should be in P tag when selection deleted by key (start of first p and start of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "sdbbbbb"
	end
	
	it "All text should be in P tag when selection deleted by key (end of first p and start of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aaaaasdbbbbb"
	end
	
	it "All text should be in P tag when selection deleted by key (end of first p and middle of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aaaaasdbbb"
	end
	
	it "All text should be in P tag when selection deleted by key (end of first p and end of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aaaaasd"
	end
	
	it "All text should be in P tag when selection deleted by key (middle of first p and middle of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aasdbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by key (middle of first p and start of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aasdbbbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by key (middle of first p and end of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aasd"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by key (start of first p and middle of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "sdbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by key (start of first p and end of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "sd"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by key (start of first p and start of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "sdbbbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by key (end of first p and start of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,0);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aaaaasdbbbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by key (end of first p and middle of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aaaaasdbbb"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection deleted by key (end of first p and end of second p - 3 p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		@iframe.send_keys :enter
		@iframe.send_keys 'ccccc'
		@iframe.ps.size.should == 3
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "var b = $('iframe').contents().find('p')[1];"
		selection_script << "rng.setStart(a.firstChild,5);"
		selection_script << "rng.setEnd(b.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aaaaasd"
		@iframe.p(:index => 1).text.should == "ccccc"
	end
	
	it "All text should be in P tag when selection (from middle to end) deleted by key inside P (2 P)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(a.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aasd"
		@iframe.p(:index => 1).text.should == "bbbbb"
	end
	
	it "All text should be in P tag when selection (from middle to end) deleted by backspace inside P (2 P)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(a.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@iframe.send_keys :backspace
		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "aasd"
		@iframe.p(:index => 1).text.should == "bbbbb"
	end
	
	it "All text should be in P tag when selection (from middle to start) deleted by key inside P (2 P)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(a.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "sdaaa"
		@iframe.p(:index => 1).text.should == "bbbbb"
	end
	
	it "All text should be in P tag when selection (from middle to start) deleted by backspace inside P (2 P)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(a.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@iframe.send_keys :backspace
		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "sdaaa"
		@iframe.p(:index => 1).text.should == "bbbbb"
	end
	
	it "All text should be in P tag when selection deleted by key inside P (2 P)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,1);"
		selection_script << "rng.setEnd(a.firstChild,3);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "asdaa"
		@iframe.p(:index => 1).text.should == "bbbbb"
	end
	
	it "All text should be in P tag when selection deleted by backspace inside P (2 P)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,1);"
		selection_script << "rng.setEnd(a.firstChild,3);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys :backspace
		@iframe.send_keys "sd"
		@iframe.ps.size.should == 2
		@iframe.p(:index => 0).text.should == "asdaa"
		@iframe.p(:index => 1).text.should == "bbbbb"
	end
	
	
	it "All text should be in P tag when selection (from middle to end) deleted by key inside P" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.ps.size.should == 1
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(a.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aasd"
	end
	
	it "All text should be in P tag when selection (from middle to end) deleted by backspace inside P" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.ps.size.should == 1
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(a.firstChild,5);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@iframe.send_keys :backspace
		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "aasd"
	end
	
	it "All text should be in P tag when selection (from middle to start) deleted by key inside P" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.ps.size.should == 1
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(a.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "sdaaa"
	end
	
	it "All text should be in P tag when selection (from middle to start) deleted by backspace inside P" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.ps.size.should == 1
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,0);"
		selection_script << "rng.setEnd(a.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@iframe.send_keys :backspace
		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "sdaaa"
	end
	
	it "All text should be in P tag when selection deleted by key inside P" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.ps.size.should == 1
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,1);"
		selection_script << "rng.setEnd(a.firstChild,3);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "asdaa"
	end
	
	it "All text should be in P tag when selection deleted by backspace inside P" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.ps.size.should == 1
		
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,1);"
		selection_script << "rng.setEnd(a.firstChild,3);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

		@iframe.send_keys :backspace
		@iframe.send_keys "sd"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "asdaa"
	end
	
	after(:all) do
		@b.close
	end

end