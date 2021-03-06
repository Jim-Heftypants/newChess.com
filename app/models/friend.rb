class Friend < ApplicationRecord
    validates :central_user_id,
     :foreign_user_id,
       presence: true

    validates :accepted, inclusion: [true, false]

    belongs_to :primary_user,
        foreign_key: :foreign_user_id,
        primary_key: :id,
        class_name: :User

    belongs_to :foreign_user,
        foreign_key: :central_user_id,
        primary_key: :id,
        class_name: :User

end