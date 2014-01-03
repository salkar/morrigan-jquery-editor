require 'watir-webdriver'
require 'rspec'
require 'rubygems'

describe "Chrome blocks move actions" do

  before :all do
    @b = Watir::Browser.new :chrome
  end

  before :each do
    @b.goto 'http://192.168.0.103:3000/single_test'
    @i = @b.frame :index => 0
  end

  it 'move top action should work' do
    html = '<p>Line 1</p><p>Line 2</p><p>Line 3</p><div class="mrge-content-block mrge-left-side" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Chrysanthemum.jpg" style="max-width: 150px; max-height: 270px;"></div></div>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @i.img.when_present.hover
    @b.body.click
    block_index = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').index();")
    block_top = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').position().top;")
    @i.div(:class => 'mrge-content-block-top').when_present.click
    @b.body.click
    @b.execute_script("return $('iframe').contents().find('.mrge-content-block').index();").should == block_index - 1
    @b.execute_script("return $('iframe').contents().find('.mrge-content-block').position().top;").should < block_top
  end

  it 'move top action should not remove block on top of body children' do
    html = '<p>Line 1</p><div class="mrge-content-block mrge-left-side" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Chrysanthemum.jpg" style="max-width: 150px; max-height: 270px;"></div></div>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @i.img.when_present.hover
    @b.body.click
    block_index = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').index();")
    block_top = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').position().top;")
    @i.div(:class => 'mrge-content-block-top').when_present.click
    @b.body.click
    second_index = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').index();")
    second_index.should == block_index - 1
    second_block_top = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').position().top;")
    second_block_top.should < block_top
    @i.img.when_present.hover
    @i.div(:class => 'mrge-content-block-top').when_present.click
    @i.divs(:class => 'mrge-content-block').size.should == 1
    @b.body.click
    @b.execute_script("return $('iframe').contents().find('.mrge-content-block').index();").should == second_index
    @b.execute_script("return $('iframe').contents().find('.mrge-content-block').position().top;").should == second_block_top
  end

  it 'block should go above previous block' do
    html = '<p>Line 1</p><p>Line 2</p>' +
        '<div class="mrge-content-block mrge-left-side block-1" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Chrysanthemum.jpg" style="max-width: 150px; max-height: 270px;"></div></div>' +
        '<p>Line 3</p><p>Line 4</p><p>Line 5</p><p>Line 6</p><p>Line 7</p><p>Line 8</p><p>Line 9</p><p>Line 10</p><p>Line 11</p>' +
        '<div class="mrge-content-block mrge-left-side block-2" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Desert.jpg" style="max-width: 150px; max-height: 270px;"></div></div>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @i.img(:index => 1).when_present.hover
    @i.div(:class => 'mrge-content-block-top').when_present.click
    @b.body.click
    block1_left_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    block1_left_position.should == block2_left_position
    block1_top_position.should < block2_top_position
    @i.img(:index => 1).when_present.hover
    @i.div(:class => 'mrge-content-block-top').when_present.click
    @b.body.click
    block1_left_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    block1_top_position_1.should > block2_top_position_1
    block1_left_position_1.should == block2_left_position_1
    block1_top_position_1.should > block1_top_position
    block1_left_position_1.should == block1_left_position
    block2_top_position_1.should < block2_top_position
    block2_left_position_1.should == block2_left_position
  end

  it 'move down action should work' do
    html = '<p>Line 1</p><div class="mrge-content-block mrge-left-side" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Chrysanthemum.jpg" style="max-width: 150px; max-height: 270px;"></div></div><p>Line 2</p><p>Line 3</p>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @i.img.when_present.hover
    @b.body.click
    block_index = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').index();")
    block_top = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').position().top;")
    @i.div(:class => 'mrge-content-block-bottom').when_present.click
    @b.body.click
    @b.execute_script("return $('iframe').contents().find('.mrge-content-block').index();").should == block_index + 1
    @b.execute_script("return $('iframe').contents().find('.mrge-content-block').position().top;").should > block_top
  end

  it 'move down action should not remove block on bottom of body children' do
    html = '<div class="mrge-content-block mrge-left-side" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Chrysanthemum.jpg" style="max-width: 150px; max-height: 270px;"></div></div><p>Line 1</p>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @i.img.when_present.hover
    @b.body.click
    block_index = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').index();")
    block_top = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').position().top;")
    @i.div(:class => 'mrge-content-block-bottom').when_present.click
    @b.body.click
    second_index = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').index();")
    second_index.should == block_index + 1
    second_block_top = @b.execute_script("return $('iframe').contents().find('.mrge-content-block').position().top;")
    second_block_top.should > block_top
    @i.img.when_present.hover
    @i.div(:class => 'mrge-content-block-bottom').when_present.click
    @i.divs(:class => 'mrge-content-block').size.should == 1
    @b.body.click
    @b.execute_script("return $('iframe').contents().find('.mrge-content-block').index();").should == second_index
    @b.execute_script("return $('iframe').contents().find('.mrge-content-block').position().top;").should == second_block_top
  end

  it 'block should move to bottom of next block' do
    html = '<p>Line 1</p><p>Line 2</p>' +
        '<div class="mrge-content-block mrge-left-side block-1" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Chrysanthemum.jpg" style="max-width: 150px; max-height: 270px;"></div></div>' +
        '<div class="mrge-content-block mrge-left-side block-2" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Desert.jpg" style="max-width: 150px; max-height: 270px;"></div></div>' +
        '<p>Line 3</p><p>Line 4</p><p>Line 5</p><p>Line 6</p><p>Line 7</p><p>Line 8</p><p>Line 9</p><p>Line 10</p><p>Line 11</p>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    @b.body.click
    block1_left_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    block1_left_position.should == block2_left_position
    block1_top_position.should < block2_top_position
    @i.img(:index => 0).when_present.hover
    @i.div(:class => 'mrge-content-block-bottom').when_present.click
    @b.body.click
    block1_left_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    block1_left_position.should == block2_left_position
    block1_top_position.should > block2_top_position
    @i.img(:index => 0).when_present.hover
    @i.div(:class => 'mrge-content-block-bottom').when_present.click
    @b.body.click
    block1_left_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    block1_top_position_1.should < block2_top_position_1
    block1_left_position_1.should == block2_left_position_1
    block1_top_position_1.should < block1_top_position
    block1_left_position_1.should == block1_left_position
    block2_top_position_1.should > block2_top_position
    block2_left_position_1.should == block2_left_position
  end

  it 'block should move down through several paragraphs when other it touching the other block' do
    html = '<p>Line 1</p><p>Line 2</p>' +
        '<div class="mrge-content-block mrge-left-side block-1" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Chrysanthemum.jpg" style="max-width: 150px; max-height: 270px;"></div></div>' +
        '<div class="mrge-content-block mrge-left-side block-2" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Desert.jpg" style="max-width: 150px; max-height: 270px;"></div></div>' +
        '<p>Line 3</p><p>Line 4</p><p>Line 5</p><p>Line 6</p><p>Line 7</p><p>Line 8</p><p>Line 9</p><p>Line 10</p><p>Line 11</p>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    sleep 1
    @b.body.click
    block1_left_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    index = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').index();")
    block1_left_position.should == block2_left_position
    block1_top_position.should < block2_top_position

    @i.img(:index => 1).when_present.hover
    @i.div(:class => 'mrge-content-block-bottom').when_present.click
    @b.body.click
    block1_left_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    index_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').index();")
    block1_left_position_1.should == block2_left_position_1
    block1_top_position_1.should == block1_top_position
    block2_top_position_1.should > block2_top_position
    index_1.should > index + 1

    @i.img(:index => 1).when_present.hover
    @i.div(:class => 'mrge-content-block-bottom').when_present.click
    @b.body.click
    block1_left_position_2 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position_2 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position_2 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position_2 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    index_2 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').index();")
    block1_left_position_2.should == block2_left_position_2
    block1_top_position_2.should == block1_top_position_1
    block2_top_position_2.should > block2_top_position_1
    index_2.should == index_1 + 1
  end

  it 'block should change place with bottom block' do
    html = '<p>Line 1</p>' +
        '<div class="mrge-content-block mrge-left-side block-1" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Chrysanthemum.jpg" style="max-width: 150px; max-height: 270px;"></div></div>' +
        '<p>Line 2</p><p>Line 3</p><p>Line 4</p><p>Line 5</p><p>Line 6</p><p>Line 7</p><p>Line 8</p>' +
        '<div class="mrge-content-block mrge-left-side block-2" contenteditable="false"><div class="mrge-content-block-item"><img src="/images/Desert.jpg" style="max-width: 150px; max-height: 270px;"></div></div>' +
        '<p>Line 9</p><p>Line 10</p><p>Line 11</p>'
    @b.execute_script "editor.morrigan_editor('html', '#{html}');"
    sleep 1
    @b.body.click
    block1_left_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    block1_left_position.should == block2_left_position
    block1_top_position.should < block2_top_position

    @i.img(:index => 0).when_present.hover
    @i.div(:class => 'mrge-content-block-bottom').when_present.click
    @b.body.click
    block1_left_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position_1 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    block1_left_position_1.should == block2_left_position_1
    block2_top_position_1.should < block2_top_position
    block1_top_position_1.should == block2_top_position
    block2_top_position_1.should == block1_top_position
    block2_top_position_1.should < block1_top_position_1

    @i.img(:index => 0).when_present.hover
    @i.div(:class => 'mrge-content-block-bottom').when_present.click
    @b.body.click
    block1_left_position_2 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().left;")
    block1_top_position_2 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-1').position().top;")
    block2_left_position_2 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().left;")
    block2_top_position_2 = @b.execute_script("return $('iframe').contents().find('.mrge-content-block.block-2').position().top;")
    block1_left_position_2.should == block2_left_position_2
    block1_top_position_2.should == block1_top_position
    block2_top_position_2.should == block2_top_position
  end

  after(:all) do
    #@b.close
  end

end