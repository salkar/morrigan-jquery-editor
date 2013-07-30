class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :img
      t.timestamps
    end
  end
end
