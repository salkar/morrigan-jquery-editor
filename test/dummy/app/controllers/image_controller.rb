class ImageController < ApplicationController
  def create
    #uploader = ImageUploader.new
    #puts uploader.store!(params["upload_img"])
    img = Image.create :img => params["upload_img"]
    render :json => {:data => img.img.url}
  end
end