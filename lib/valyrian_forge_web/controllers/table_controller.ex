defmodule ValyrianForgeWeb.TableController do
  use ValyrianForgeWeb, :controller

  def index(conn, _params) do
    # Hardcoded list of tables
    tables = [
      %{id: 1, name: "Table 1", description: "A sturdy wooden table"},
      %{id: 2, name: "Table 2", description: "A sleek glass table"},
      %{id: 3, name: "Table 3", description: "A modern steel table"}
    ]

    # Respond with the list of tables as JSON
    conn
    |> put_status(:ok)
    |> json(%{data: tables})
  end
end
