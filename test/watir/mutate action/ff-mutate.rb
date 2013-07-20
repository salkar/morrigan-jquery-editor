require 'watir-webdriver'
require 'rspec'
require 'rubygems'

describe "FF mutate actions" do

	before :each do
		@b = Watir::Browser.new 
		@b.goto 'http://192.168.56.101:3000/single_test'
		@iframe = @b.frame :index => 0
	end
	
	it "P should be mutated to H1 when cursor caret is on P" do
		@b.execute_script "editor.morrigan_editor('addHTML', '<p>paragraph</p>');"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "paragraph"
		@iframe.h1s.size.should == 0
		
		@iframe.send_keys :tab
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(a.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@b.link(:id => 'mrge_format').click
		Watir::Wait.until { @b.div(:id => 'mrge_H1').visible? }
		@b.div(:id => 'mrge_H1').click
		
		@iframe.h1s.size.should == 1
		@iframe.h1s.first.text.should == "paragraph"
		@iframe.ps.size.should == 0
	end
	
	it "P should be mutated to H1 when selected range is on P" do
		@b.execute_script "editor.morrigan_editor('addHTML', '<p>paragraph</p>');"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "paragraph"
		@iframe.h1s.size.should == 0
		
		@iframe.send_keys :tab
		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(a.firstChild,3);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@b.link(:id => 'mrge_format').click
		Watir::Wait.until { @b.div(:id => 'mrge_H1').visible? }
		@b.div(:id => 'mrge_H1').click
		
		@iframe.h1s.size.should == 1
		@iframe.h1s.first.text.should == "paragraph"
		@iframe.ps.size.should == 0
	end
	
	it "P should be mutated to H1 when selected range is on P (several p with scroll)" do
		html = ""
		(1..25).each {|i| html += "<p>paragraph #{i}</p>"}
		@b.execute_script "editor.morrigan_editor('addHTML', '#{html}');"
		@iframe.ps.size.should == 25
		@iframe.p(:index => 24).text.should == "paragraph 25"
		@iframe.h1s.size.should == 0
		
		@iframe.send_keys :tab
		@b.body.click
		
		scroll_script = "$('iframe').contents().scrollTop(10000)"
		@b.execute_script scroll_script
		
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[24];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(a.firstChild,3);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@b.link(:id => 'mrge_format').click
		Watir::Wait.until { @b.div(:id => 'mrge_H1').visible? }
		@b.div(:id => 'mrge_H1').click
		
		@iframe.h1s.size.should == 1
		@iframe.h1s.first.text.should == "paragraph 25"
		@iframe.ps.size.should == 24
	end
	
	it "P should be mutated to H1 when cursor caret is on P (several p with scroll)" do
		html = ""
		(1..25).each {|i| html += "<p>paragraph #{i}</p>"}
		@b.execute_script "editor.morrigan_editor('addHTML', '#{html}');"
		@iframe.ps.size.should == 25
		@iframe.p(:index => 24).text.should == "paragraph 25"
		@iframe.h1s.size.should == 0
		
		@iframe.send_keys :tab
		@b.body.click
		
		scroll_script = "$('iframe').contents().scrollTop(10000)"
		@b.execute_script scroll_script
		
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[24];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(a.firstChild,2);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@b.link(:id => 'mrge_format').click
		Watir::Wait.until { @b.div(:id => 'mrge_H1').visible? }
		@b.div(:id => 'mrge_H1').click
		
		@iframe.h1s.size.should == 1
		@iframe.h1s.first.text.should == "paragraph 25"
		@iframe.ps.size.should == 24
	end
	
	it "Ps should be mutated to H1 (several p with scroll, sequential order of selection)" do
		html = ""
		(1..25).each {|i| html += "<p>paragraph #{i}</p>"}
		@b.execute_script "editor.morrigan_editor('addHTML', '#{html}');"
		@iframe.ps.size.should == 25
		@iframe.p(:index => 23).text.should == "paragraph 24"
		@iframe.p(:index => 24).text.should == "paragraph 25"
		@iframe.h1s.size.should == 0
		
		@iframe.send_keys :tab
		@b.body.click
		
		scroll_script = "$('iframe').contents().scrollTop(10000)"
		@b.execute_script scroll_script
		
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[23];"
		selection_script << "var b = $('iframe').contents().find('p')[24];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,3);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@b.link(:id => 'mrge_format').click
		Watir::Wait.until { @b.div(:id => 'mrge_H1').visible? }
		@b.div(:id => 'mrge_H1').click
		
		@iframe.h1s.size.should == 2
		@iframe.h1s.first.text.should == "paragraph 24"
		@iframe.h1s[1].text.should == "paragraph 25"
		@iframe.ps.size.should == 23
	end
	
	it "Selection should be restored after mutate action" do
		html = ""
		(1..25).each {|i| html += "<p>paragraph #{i}</p>"}
		@b.execute_script "editor.morrigan_editor('addHTML', '#{html}');"
		@iframe.ps.size.should == 25
		@iframe.p(:index => 20).text.should == "paragraph 21"
		@iframe.p(:index => 22).text.should == "paragraph 23"
		@iframe.h1s.size.should == 0
		
		@iframe.send_keys :tab
		@b.body.click
		
		scroll_script = "$('iframe').contents().scrollTop(10000)"
		@b.execute_script scroll_script
		
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[20];"
		selection_script << "var b = $('iframe').contents().find('p')[22];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(b.firstChild,3);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script
		
		@b.link(:id => 'mrge_format').click
		Watir::Wait.until { @b.div(:id => 'mrge_H1').visible? }
		@b.div(:id => 'mrge_H1').click
		
		@iframe.h1s.size.should == 3
		@iframe.h1s.first.text.should == "paragraph 21"
		@iframe.h1s[1].text.should == "paragraph 22"
		@iframe.h1s[2].text.should == "paragraph 23"
		@iframe.ps.size.should == 22
		
		@iframe.send_keys "ooo"
		@iframe.h1s.size.should == 1
		@iframe.h1s.first.text.should == "paoooagraph 23"
	end
	
	
	after(:each) do
		@b.close
	end

end