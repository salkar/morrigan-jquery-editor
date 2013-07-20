require 'watir-webdriver'
require 'rspec'
require 'rubygems'

describe "Opera addHTML public api" do

	before :each do
		@b = Watir::Browser.new :opera 
		@b.goto 'http://192.168.56.101:3000/single_test'
		@iframe = @b.frame :index => 0
	end
	
	it "HTML should be added to editor body" do
		@b.execute_script "editor.morrigan_editor('addHTML', '<h1>Header</h1><p>paragraph</p>'); return true;"

		@iframe.ps.size.should == 1
		@iframe.p(:index => 0).text.should == "paragraph"
		@iframe.h1s.size.should == 1
		@iframe.h1s.first.text.should == "Header"
	end
	
	
	after(:each) do
		@b.close
	end

end