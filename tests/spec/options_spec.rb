require 'watir-webdriver'
require 'rspec'
require 'rubygems'

describe 'Options' do
  describe 'width' do
    it 'should work in %' do
      start_editor params: <<-JS
                iframeStyles: '/base/css/iframe.css',
                width: '100%'
      JS
      expect(editor.style('width')).to eq(@b.body.style('width'))
    end

    it 'should work in px' do
      start_editor params: <<-JS
                iframeStyles: '/base/css/iframe.css',
                width: '250px'
      JS
      expect(editor.style('width')).to eq('250px')
    end
  end

  describe 'height' do
    it 'should work in px' do
      start_editor params: <<-JS
                iframeStyles: '/base/css/iframe.css',
                height: '200px'
      JS
      expect(editor.style('height')).to eq('200px')
    end
  end

  describe 'doctype' do
    it 'should work' do
      doctype = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'
      start_editor params: <<-JS
                iframeStyles: '/base/css/iframe.css',
                doctype: '#{doctype}'
      JS
      expect(iframe_doctype.downcase).to eq(doctype.downcase)
    end
  end

  describe 'spell check' do
    it 'should be enable by default' do
      start_editor
      expect(@b.iframe(index: 0).body.html.include?('spellcheck="false"')).to eq(false)
    end

    it 'should be disabled with custom settings' do
      start_editor params: <<-JS
                iframeStyles: '/base/css/iframe.css',
                spellCheck: false
      JS
      expect(@b.iframe(index: 0).body.html.include?('spellcheck="false"')).to eq(true)
    end
  end

  describe 'toolbox' do
    it 'should be by default' do
      start_editor
      expect(actions.size).to eq(@b.execute_script(
                                       <<-JS
                                          return $('#editor').morrigan_editor('option', 'toolbox').toString().split(',').length;
                                       JS
                                 ))
    end

    it 'should be with custom settings' do
      start_editor params: <<-JS
                iframeStyles: '/base/css/iframe.css',
                toolbox: [
                    [
                        ['format', 'clearFormat'],
                        ['bold', 'italy', 'strike'],
                        ['img'],
                        ['alignLeft', 'alignCenter', 'alignRight']
                    ]
                ]
      JS
      expect(actions.size).to eq(9)
    end
  end

  describe 'popup' do
    it 'should be by default' do
      start_editor
      @iframe.click
      @b.a(class: 'mrge-action-img').click
      popup = @b.div(class: 'mrge-popup')
      popup.wait_until_present
      expect(popup.divs(class: 'mrge-popup-btn').size).to eq(2)
      expect(popup.divs(class: 'mrge-popup-ok').size).to eq(1)
      expect(popup.div(class: 'mrge-popup-ok').text).to eq('Ok')
      expect(popup.divs(class: 'mrge-popup-cancel').size).to eq(1)
      expect(popup.div(class: 'mrge-popup-cancel').text).to eq('Cancel')
    end
  end
end