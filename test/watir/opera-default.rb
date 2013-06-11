require 'watir-webdriver'
require 'rspec'
require 'rubygems'

describe "Opera default container behavior" do

	before :each do
		@b = Watir::Browser.new :opera
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
		@iframe.send_keys :backspace
		(0..5).each { @iframe.send_keys :backspace }
		@iframe.p(:index => 0).html.should == "<p><br></p>"
	end
	
	it "All text should be in P tag when selection deleted by backspace (middle of first p and middle of second p)" do
		@iframe.click
		@iframe.send_keys 'aaaaa'
		@iframe.send_keys :enter
		@iframe.send_keys 'bbbbb'
		@iframe.ps.size.should == 2
		
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
	
	after(:each) do
		@b.close
	end

end