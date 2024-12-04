defmodule ValyrianForgeWeb.Router do
  use ValyrianForgeWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {ValyrianForgeWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Plug.CORSPlug, origin: "*"
  end

  scope "/", ValyrianForgeWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  scope "/api", ValyrianForgeWeb do
    pipe_through :api

    get "/tables", TableController, :index
    post "/tables", TableController, :create
    patch "/tables/:table_name", TableController, :update
    delete "/tables/:table_name", TableController, :delete
    get "/tables/:table_name", TableController, :show
  end

  if Application.compile_env(:valyrian_forge, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: ValyrianForgeWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
