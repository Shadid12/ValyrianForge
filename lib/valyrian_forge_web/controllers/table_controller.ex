defmodule ValyrianForgeWeb.TableController do
  use ValyrianForgeWeb, :controller
  alias ValyrianForge.LibSQLClient

  def index(conn, _params) do
    # Query to fetch table names
    query = "SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%';"

    case LibSQLClient.query(query) do
      {:ok, [%{"results" => %{"columns" => ["name"], "rows" => rows}}]} ->
        # Map rows into a list of table names
        tables = Enum.map(rows, fn [name] -> %{name: name} end)

        conn
        |> put_status(:ok)
        |> json(%{data: tables})

      {:ok, _response} ->
        # Handle unexpected empty or malformed response
        conn
        |> put_status(:not_found)
        |> json(%{error: "No tables found"})

      {:error, reason} ->
        # Handle query error
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: reason})
    end
  end
end
