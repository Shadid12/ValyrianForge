defmodule ValyrianForgeWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :valyrian_forge

  @session_options [
    store: :cookie,
    key: "_valyrian_forge_key",
    signing_salt: "3mSr4O6e",
    same_site: "Lax"
  ]

  socket "/live", Phoenix.LiveView.Socket,
    websocket: [connect_info: [session: @session_options]],
    longpoll: [connect_info: [session: @session_options]]

  plug Plug.Static,
    at: "/",
    from: :valyrian_forge,
    gzip: false,
    only: ValyrianForgeWeb.static_paths()

  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
    plug Phoenix.Ecto.CheckRepoStatus, otp_app: :valyrian_forge
  end

  plug Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head

  plug Plug.CORSPlug,
    origin: "*"

  plug Plug.Session, @session_options
  plug ValyrianForgeWeb.Router
end
