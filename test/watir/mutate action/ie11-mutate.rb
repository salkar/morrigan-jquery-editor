require 'watir-webdriver'
require 'rspec'
require 'rubygems'

describe "IE11 mutate actions" do

  before :all do
    @b = Watir::Browser.new :ie
  end

	before :each do
		@b.goto 'http://192.168.0.102:3000/single_test'
		@iframe = @b.frame :index => 0
	end

  it "P should be mutated to H2 when cursor caret is on P" do
    @b.execute_script "editor.morrigan_editor('html', '<p>paragraph</p>');"
    @iframe.ps.size.should == 1
    @iframe.p(:index => 0).text.should == "paragraph"
    @iframe.h2s.size.should == 0

    @b.body.click
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "rng.setStart(a.firstChild,2);"
    selection_script << "rng.setEnd(a.firstChild,2);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Heading 1.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Heading 1.*/).click

    @iframe.h2s.size.should == 1
    @iframe.h2s.first.text.should == "paragraph"
    @iframe.ps.size.should == 0
  end
	
	it "P should be mutated to H2 when selected range is on P" do
		@b.execute_script "editor.morrigan_editor('html', '<p>paragraph</p>');"
		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "paragraph"
		@iframe.h2s.size.should == 0

		@b.body.click
		selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
		selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
		selection_script << "var a = $('iframe').contents().find('p')[0];"
		selection_script << "rng.setStart(a.firstChild,2);"
		selection_script << "rng.setEnd(a.firstChild,3);"
		selection_script << "selection.removeAllRanges();"
		selection_script << "selection.addRange(rng);"
		@b.execute_script selection_script

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Heading 1.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Heading 1.*/).click
		
		@iframe.h2s.size.should == 1
		@iframe.h2s.first.text.should == "paragraph"
		@iframe.ps.size.should == 0
	end
	
	it "P should be mutated to H2 when selected range is on P (several p with scroll)" do
		html = ''
		(1..25).each {|i| html += "<p>paragraph #{i}</p>"}
		@b.execute_script "editor.morrigan_editor('html', '#{html}');"
		@iframe.ps.size.should == 25
		@iframe.p(:index => 24).text.should == "paragraph 25"
		@iframe.h2s.size.should == 0

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

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Heading 1.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Heading 1.*/).click
		
		@iframe.h2s.size.should == 1
		@iframe.h2s.first.text.should == "paragraph 25"
		@iframe.ps.size.should == 24
	end
	
	it "P should be mutated to H2 when cursor caret is on P (several p with scroll)" do
		html = ''
		(1..25).each {|i| html += "<p>paragraph #{i}</p>"}
		@b.execute_script "editor.morrigan_editor('html', '#{html}');"
		@iframe.ps.size.should == 25
		@iframe.p(:index => 24).text.should == "paragraph 25"
		@iframe.h2s.size.should == 0

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

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Heading 1.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Heading 1.*/).click
		
		@iframe.h2s.size.should == 1
		@iframe.h2s.first.text.should == "paragraph 25"
		@iframe.ps.size.should == 24
	end
	
	it "Ps should be mutated to H2 (several p with scroll)" do
		html = ''
		(1..25).each {|i| html += "<p>paragraph #{i}</p>"}
		@b.execute_script "editor.morrigan_editor('html', '#{html}');"
		@iframe.ps.size.should == 25
		@iframe.p(:index => 23).text.should == "paragraph 24"
		@iframe.p(:index => 24).text.should == "paragraph 25"
		@iframe.h2s.size.should == 0

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

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Heading 1.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Heading 1.*/).click
		
		@iframe.h2s.size.should == 2
		@iframe.h2s.first.text.should == "paragraph 24"
		@iframe.h2s[1].text.should == "paragraph 25"
		@iframe.ps.size.should == 23
	end
	
	it "Selection should be restored after mutate action" do
		html = ''
		(1..25).each {|i| html += "<p>paragraph #{i}</p>"}
		@b.execute_script "editor.morrigan_editor('html', '#{html}');"
		@iframe.ps.size.should == 25
		@iframe.p(:index => 20).text.should == "paragraph 21"
		@iframe.p(:index => 22).text.should == "paragraph 23"
		@iframe.h1s.size.should == 0

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

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Heading 1.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Heading 1.*/).click
		
		@iframe.h2s.size.should == 3
		@iframe.h2s.first.text.should == "paragraph 21"
		@iframe.h2s[1].text.should == "paragraph 22"
		@iframe.h2s[2].text.should == "paragraph 23"
		@iframe.ps.size.should == 22
		
		@iframe.send_keys "ooo"
		@iframe.h2s.size.should == 1
		@iframe.h2s.first.text.should == "paoooagraph 23"
	end

  it "there is correct format tag when cursor caret is on P tag" do
    html = '<p>Paragraph 1</p><h2>Header 1</h2><h3>Header 2</h3><h4>Header 3</h4>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @iframe.p.click
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Paragraph'
  end

  it "there is correct format tag when cursor caret is on H2 tag" do
    html = '<p>Paragraph 1</p><h2>Header 1</h2><h3>Header 2</h3><h4>Header 3</h4>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @iframe.h2.click
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 1'
  end

  it "there is correct format tag when cursor caret is on H3 tag" do
    html = '<p>Paragraph 1</p><h2>Header 1</h2><h3>Header 2</h3><h4>Header 3</h4>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @iframe.h3.click
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 2'
  end

  it "there is correct format tag when cursor caret is on H4 tag" do
    html = '<p>Paragraph 1</p><h2>Header 1</h2><h3>Header 2</h3><h4>Header 3</h4>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @iframe.h4.click
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 3'
  end

  it "there is correct format tag when cursor caret is moved to tags by key" do
    html = '<p>Paragraph 1</p><h2>Header 1</h2><h3>Header 2</h3><h4>Header 3</h4>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @iframe.h2.click
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 1'
    @iframe.send_keys :arrow_up
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Paragraph'
    @iframe.send_keys :arrow_down
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 1'
    @iframe.send_keys :arrow_down
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 2'
    @iframe.send_keys :arrow_down
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 3'
  end

  it 'there is correct format tag when cursor caret is on the same start and end tags but tag between them is not same' do
    html = '<p>Paragraph 1</p><h2>Header 1</h2><p>Paragraph 2</p>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "var b = $('iframe').contents().find('p')[1];"
    selection_script << "rng.setStart(a.firstChild,2);"
    selection_script << "rng.setEnd(b.firstChild,2);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @iframe.body.fire_event("mouseup")
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Format'
  end

  it 'there is correct format tag when cursor caret is on the same start and end tags (paragraph)' do
    html = '<p>Paragraph 1</p><p>Paragraph 2</p><h2>Header 1</h2>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "var b = $('iframe').contents().find('p')[1];"
    selection_script << "rng.setStart(a.firstChild,2);"
    selection_script << "rng.setEnd(b.firstChild,2);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @iframe.body.fire_event("mouseup")
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Paragraph'
  end

  it 'there is correct format tag when cursor caret is on the same start and end tags (Heading 1)' do
    html = '<p>Paragraph 1</p><p>Paragraph 2</p><h2>Header 1</h2><h2>Header 1</h2><h2>Header 1</h2>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('h2')[0];"
    selection_script << "var b = $('iframe').contents().find('h2')[2];"
    selection_script << "rng.setStart(a.firstChild,2);"
    selection_script << "rng.setEnd(b.firstChild,2);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @iframe.body.fire_event("mouseup")
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 1'
  end

  it 'there is correct format tag when first symbol is passing' do
    @iframe.body.click
    @b.send_keys 'a'
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Paragraph'
  end

  it 'format status should be changed after format tag action (caret)' do
    html = '<p>Paragraph 1</p>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @b.body.click
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "rng.setStart(a.firstChild,2);"
    selection_script << "rng.setEnd(a.firstChild,2);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Paragraph'

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Heading 1.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Heading 1.*/).click
    @iframe.h2s.size.should == 1
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 1'

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Paragraph.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Paragraph.*/).click
    @iframe.ps.size.should == 1
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Paragraph'
  end

  it 'format status should be changed after format tag action (range)' do
    html = '<p>Paragraph 1</p><h3>Header 2</h3>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "var b = $('iframe').contents().find('h3')[0];"
    selection_script << "rng.setStart(a.firstChild,2);"
    selection_script << "rng.setEnd(b.firstChild,2);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @iframe.body.fire_event("mouseup")
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Format'

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Heading 1.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Heading 1.*/).click
    @iframe.h2s.size.should == 2
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 1'

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Paragraph.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Paragraph.*/).click
    @iframe.ps.size.should == 2
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Paragraph'
  end

  it 'tag should be left when formatTag with same tag exec on it (p)' do
    html = '<p>Paragraph 1</p>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @b.body.click
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "rng.setStart(a.firstChild,2);"
    selection_script << "rng.setEnd(a.firstChild,2);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Paragraph'

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Paragraph.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Paragraph.*/).click
    @iframe.ps.size.should == 1
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Paragraph'
  end

  it 'tag should be left when formatTag with same tag exec on it (h2s)' do
    html = '<h2>Header 1</h2><h2>Header 1</h2>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @b.body.click
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('h2')[0];"
    selection_script << "var b = $('iframe').contents().find('h2')[1];"
    selection_script << "rng.setStart(a.firstChild,2);"
    selection_script << "rng.setEnd(b.firstChild,2);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 1'
    @iframe.h2s.size.should == 2

    @b.link(:class => /.*mrge-action-list.*/).click
    Watir::Wait.until { @b.div(:text => /.*Heading 1.*/).visible? }
    @b.div(:class => 'mrge-action-dropdown').div(:text => /.*Heading 1.*/).click
    @iframe.h2s.size.should == 2
    @b.link(:class => /.*mrge-action-list.*/).span(:class => /.*mrge-action-text.*/).text.should == 'Heading 1'
  end

	after(:all) do
		@b.close
	end

end