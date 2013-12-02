require 'watir-webdriver'
require 'rspec'
require 'rubygems'

describe "FF main execCommand behavior" do

	before :all do
    @b = Watir::Browser.new :firefox
  end

  before :each do
		@b.goto 'http://192.168.0.102:3000/single_test'
		@iframe = @b.frame :index => 0
	end

  it 'bold action should be worked on range selection' do
    html = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>'
    @b.send_keys :tab
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "rng.setStart(a.firstChild,0);"
    selection_script << "rng.setEnd(a.firstChild,9);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should_not be
    @b.a(:title => 'Bold').click
    @iframe.bs.size.should == 1
    @iframe.b.text.should == 'Paragraph'
    @iframe.b.parent.text.should == 'Paragraph 1'
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be
  end

  it 'italic action should be worked on range selection' do
    html = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>'
    @b.send_keys :tab
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "rng.setStart(a.firstChild,0);"
    selection_script << "rng.setEnd(a.firstChild,9);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.a(:title => 'Italy').attribute_value("class").include?('mrge-active').should_not be
    @b.a(:title => 'Italy').click
    @iframe.is.size.should == 1
    @iframe.i.text.should == 'Paragraph'
    @iframe.i.parent.text.should == 'Paragraph 1'
    @b.a(:title => 'Italy').attribute_value("class").include?('mrge-active').should be
  end

  it 'strike action should be worked on range selection' do
    html = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>'
    @b.send_keys :tab
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "rng.setStart(a.firstChild,0);"
    selection_script << "rng.setEnd(a.firstChild,9);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.a(:title => 'Strike').attribute_value("class").include?('mrge-active').should_not be
    @b.a(:title => 'Strike').click
    @iframe.elements(:tag_name, 'strike').size.should == 1
    @iframe.element(:tag_name, 'strike').text.should == 'Paragraph'
    @iframe.element(:tag_name, 'strike').parent.text.should == 'Paragraph 1'
    @b.a(:title => 'Strike').attribute_value("class").include?('mrge-active').should be
  end

  it 'action should change his state on caret selections' do
    html = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>'
    @b.send_keys :tab
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "rng.setStart(a.firstChild,0);"
    selection_script << "rng.setEnd(a.firstChild,9);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.a(:title => 'Bold').click
    @iframe.b.text.should == 'Paragraph'
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be

    @b.body.click
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[1];"
    selection_script << "rng.setStart(a.firstChild,1);"
    selection_script << "rng.setEnd(a.firstChild,1);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @b.send_keys :tab
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should_not be

    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('b')[0];"
    selection_script << "rng.setStart(a.firstChild,1);"
    selection_script << "rng.setEnd(a.firstChild,1);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.send_keys :tab
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be
  end

  it 'action should change his state on range selections' do
    html = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>'
    @b.send_keys :tab
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "rng.setStart(a.firstChild,0);"
    selection_script << "rng.setEnd(a.firstChild,9);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.a(:title => 'Bold').click
    @iframe.b.text.should == 'Paragraph'
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be

    @b.body.click
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('b')[0];"
    selection_script << "var b = $('iframe').contents().find('p')[1];"
    selection_script << "rng.setStart(a.firstChild,1);"
    selection_script << "rng.setEnd(b.firstChild,1);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @b.send_keys :tab
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should_not be

    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('b')[0];"
    selection_script << "rng.setStart(a.firstChild,1);"
    selection_script << "rng.setEnd(a.firstChild,3);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.send_keys :tab
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be
  end

  it 'action state should be changed on inactive range status changes to active caret' do
    html = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>'
    @b.send_keys :tab
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "rng.setStart(a.firstChild,0);"
    selection_script << "rng.setEnd(a.firstChild,9);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.a(:title => 'Bold').click
    @iframe.b.text.should == 'Paragraph'
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be

    @b.body.click
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('b')[0];"
    selection_script << "var b = $('iframe').contents().find('p')[1];"
    selection_script << "rng.setStart(a.firstChild,1);"
    selection_script << "rng.setEnd(b.firstChild,1);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @b.send_keys :tab
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should_not be

    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('b')[0];"
    selection_script << "rng.setStart(a.firstChild,3);"
    selection_script << "rng.setEnd(a.firstChild,3);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.send_keys :tab
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be
  end

  it 'several action\'s states should be changed' do
    html = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>'
    @b.send_keys :tab
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('p')[0];"
    selection_script << "rng.setStart(a.firstChild,0);"
    selection_script << "rng.setEnd(a.firstChild,9);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.a(:title => 'Bold').click
    @iframe.b.text.should == 'Paragraph'
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be
    @b.a(:title => 'Italy').click
    @b.a(:title => 'Italy').attribute_value("class").include?('mrge-active').should be

    @b.body.click
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('b')[0];"
    selection_script << "var b = $('iframe').contents().find('p')[1];"
    selection_script << "rng.setStart(a.firstChild,1);"
    selection_script << "rng.setEnd(b.firstChild,1);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @b.send_keys :tab
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should_not be
    @b.a(:title => 'Italy').attribute_value("class").include?('mrge-active').should_not be

    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('b')[0];"
    selection_script << "rng.setStart(a.firstChild,3);"
    selection_script << "rng.setEnd(a.firstChild,3);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script

    @b.send_keys :tab
    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be
    @b.a(:title => 'Italy').attribute_value("class").include?('mrge-active').should be
  end

  it 'several action\'s states should be shown (i into b)' do
    html = '<p><b><i>Paragraph</i></b> 1</p>'
    @b.send_keys :tab
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('i')[0];"
    selection_script << "rng.setStart(a.firstChild,3);"
    selection_script << "rng.setEnd(a.firstChild,3);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @b.send_keys :tab

    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be
    @b.a(:title => 'Italy').attribute_value("class").include?('mrge-active').should be
  end

  it 'several action\'s states should be shown (b into i)' do
    html = '<p><i><b>Paragraph</b></i> 1</p>'
    @b.send_keys :tab
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    selection_script = "var rng = $('iframe')[0].contentWindow.document.createRange();"
    selection_script << "var selection = $('iframe').get(0).contentWindow.getSelection();"
    selection_script << "var a = $('iframe').contents().find('b')[0];"
    selection_script << "rng.setStart(a.firstChild,3);"
    selection_script << "rng.setEnd(a.firstChild,3);"
    selection_script << "selection.removeAllRanges();"
    selection_script << "selection.addRange(rng);"
    @b.execute_script selection_script
    @b.send_keys :tab

    @b.a(:title => 'Bold').attribute_value("class").include?('mrge-active').should be
    @b.a(:title => 'Italy').attribute_value("class").include?('mrge-active').should be
  end

	after(:all) do
		@b.close
	end

end