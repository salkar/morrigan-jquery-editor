class Image < ActiveRecord::Base
  attr_accessible :img
  mount_uploader :img, ImageUploader
end
