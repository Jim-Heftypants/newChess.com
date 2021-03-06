Rails.application.routes.draw do
  root to: "static_pages#root"

  namespace :api, defaults: { format: :json } do
    resources :users, except: [:index, :edit, :new]
    resource :session, only: [:create, :destroy]
    resources :goals, except: [:edit, :new]
    resources :games, except: [:edit, :new, :destroy]
    resources :friends, except: [:edit, :new]
  end
  mount ActionCable.server => '/cable'
end