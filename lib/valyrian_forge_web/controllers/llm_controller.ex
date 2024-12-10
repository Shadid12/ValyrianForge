defmodule ValyrianForgeWeb.LLMController do
  use ValyrianForgeWeb, :controller
  alias ValyrianForge.LibSQLClient
  require Logger

  # Handle any SQLite query
  def handle_query(conn, %{"q" => q} = params) do
    # Step 1: Generate the map of the database
    case generate_map_of_database(conn, "") do
      {:ok, database_map} ->
        # Step 2: Generate the prompt
        prompt = generate_prompt(database_map, q)

        # Step 3: Return the prompt as JSON response
        conn
        |> put_status(:ok)
        |> json(%{prompt: prompt})

      {:error, reason} ->
        # Log and return error response
        Logger.error("Failed to generate database map: #{inspect(reason)}")
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: reason})
    end
  end

  def generate_prompt(database_map, q) do
    database_json = Jason.encode!(%{database: database_map}, pretty: true)

    """
    The following is all the information about a database.

    #{database_json}

    #{q}

    Only write the SQL query you want to execute.
    """
  end

  def generate_map_of_database(conn, _query) do
    # Step 1: Get all table names
    case LibSQLClient.query_with_params("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;", []) do
      {:ok, [%{"results" => %{"rows" => tables}}]} ->
        tables = Enum.map(tables, fn [table_name] -> table_name end)

        # Step 2: Build a map for each table
        database_map =
          Enum.reduce(tables, %{}, fn table, acc ->
            acc
            |> Map.put(table, %{
              schema: get_table_schema(conn, table),
              relationships: get_table_relationships(conn, table)
            })
          end)

        {:ok, database_map}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp get_table_schema(conn, table_name) do
    query = "PRAGMA table_info('#{table_name}');"

    case LibSQLClient.query_with_params(query, []) do
      {:ok, [%{"results" => %{"rows" => rows}}]} ->
        Enum.map(rows, fn [cid, name, type, notnull, dflt_value, pk] ->
          %{
            column_id: cid,
            name: name,
            type: type,
            not_null: notnull == 1,
            default: dflt_value,
            primary_key: pk == 1
          }
        end)

      {:error, _reason} ->
        []
    end
  end

  defp get_table_relationships(conn, table_name) do
    query = "PRAGMA foreign_key_list('#{table_name}');"

    case LibSQLClient.query_with_params(query, []) do
      {:ok, [%{"results" => %{"rows" => rows}}]} ->
        Enum.map(rows, fn [id, seq, table, from, to, on_update, on_delete, match] ->
          %{
            id: id,
            seq: seq,
            referenced_table: table,
            from_column: from,
            to_column: to,
            on_update: on_update,
            on_delete: on_delete,
            match: match
          }
        end)

      {:error, _reason} ->
        []
    end
  end

end
