Dir[File.dirname(__FILE__) + '/../support/*.rb'].each {|file| require file }

RSpec.configure do |config|
  config.before :all do
    @url = 'http://localhost/tests/index.html'
    @b = Watir::Browser.new :chrome
  end

  config.before :each do
    @b.goto(@url)
  end

  config.after :all do
    @b.close
  end
end