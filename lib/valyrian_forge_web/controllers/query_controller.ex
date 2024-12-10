defmodule ValyrianForgeWeb.QueryController do
  use ValyrianForgeWeb, :controller
  alias ValyrianForge.LibSQLClient
  require Logger

  # Handle any SQLite query
  def handle_query(conn, %{"query" => query} = params) do
    # Extract optional parameters from the payload
    params = Map.get(params, "params", [])

    case LibSQLClient.query_with_params(query, params) do
      {:ok, [%{"results" => %{"columns" => columns, "rows" => rows}}]} ->
        # Transform the result into a list of maps for JSON response
        results = Enum.map(rows, fn row -> Enum.zip(columns, row) |> Enum.into(%{}) end)

        conn
        |> put_status(:ok)
        |> json(%{data: results})

      {:error, reason} ->
        Logger.error("Query failed: #{inspect(reason)}")

        conn
        |> put_status(:internal_server_error)
        |> json(%{error: reason})
    end
  end

  # Fallback when query is not provided
  def handle_query(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "Query is required in the payload"})
  end
end
