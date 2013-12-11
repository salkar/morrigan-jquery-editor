require 'json'

class ImageController < ApplicationController
  def create
    #uploader = ImageUploader.new
    #puts uploader.store!(params["upload_img"])
    if params["upload_img"]
      img_url = Image.create(:img => params["upload_img"]).img.url
    else
      img_url = params["upload_url"]
    end
    render :text => {:data => img_url}.to_json
  end
end