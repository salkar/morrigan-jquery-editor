require 'json'

class ImageController < ApplicationController
  def create
    if params["upload_img"]
      img_url = Image.create(:img => params["upload_img"]).img.url
    else
      img_url = params["upload_url"]
    end
    render json: {:data => img_url}
  end
end