defmodule ValyrianForge.Repo do
  use Ecto.Repo,
    otp_app: :valyrian_forge,
    adapter: Ecto.Adapters.SQLite3
end
