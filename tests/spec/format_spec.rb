require 'watir-webdriver'
require 'rspec'
require 'rubygems'

describe 'Format' do
  describe 'p' do
    it 'should be done', with_active_editor: true do
      @iframe.send_keys 'first string'
      @iframe.send_keys :enter
      @iframe.send_keys 'second string'
      @iframe.ps.size.should == 2
      expect(@iframe.p(index: 0).text).to eq('first string')
      expect(@iframe.p(index: 1).text).to eq('second string')
    end

    it 'should be done with preventing backspace', with_active_editor: true do
      @iframe.send_keys :backspace
      @iframe.send_keys 'first string'
      @iframe.send_keys :enter
      @iframe.send_keys 'second string'
      @iframe.ps.size.should == 2
      expect(@iframe.p(index: 0).text).to eq('first string')
      expect(@iframe.p(index: 1).text).to eq('second string')
    end
  end
end