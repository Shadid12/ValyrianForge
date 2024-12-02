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


  def create(conn, %{"table_name" => table_name, "columns" => columns, "relationships" => relationships}) do
    with :ok <- validate_table_name(table_name),
         :ok <- validate_columns(columns),
         :ok <- validate_relationships(relationships) do
      # Build column definitions
      column_definitions =
        columns
        |> Enum.map(fn {col_name, col_type} -> "#{col_name} #{col_type}" end)

      # Build foreign key constraints from relationships
      relationship_definitions =
        relationships
        |> Enum.map(fn {col_name, %{"table" => ref_table, "column" => ref_column}} ->
          "FOREIGN KEY (#{col_name}) REFERENCES #{ref_table}(#{ref_column})"
        end)

      # Combine column and relationship definitions
      table_definitions = Enum.concat(column_definitions, relationship_definitions)
      |> Enum.join(", ")

      create_table_sql = "CREATE TABLE #{table_name} (#{table_definitions});"

      case LibSQLClient.query(create_table_sql) do
        {:ok, _response} ->
          conn
          |> put_status(:created)
          |> json(%{message: "Table '#{table_name}' created successfully."})

        {:error, reason} ->
          conn
          |> put_status(:internal_server_error)
          |> json(%{error: reason})
      end
    else
      {:error, message} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: message})
    end
  end

  def delete(conn, %{"table_name" => table_name}) do
    with :ok <- validate_table_name(table_name) do
      delete_table_sql = "DROP TABLE IF EXISTS #{table_name};"

      case LibSQLClient.query(delete_table_sql) do
        {:ok, _response} ->
          conn
          |> put_status(:ok)
          |> json(%{message: "Table '#{table_name}' deleted successfully."})

        {:error, reason} ->
          conn
          |> put_status(:internal_server_error)
          |> json(%{error: reason})
      end
    else
      {:error, message} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: message})
    end
  end

  defp validate_table_name(name) when is_binary(name) and byte_size(name) > 0, do: :ok
  defp validate_table_name(_), do: {:error, "Invalid table name."}

  defp validate_columns(columns) when is_map(columns) and map_size(columns) > 0 do
    if Enum.all?(columns, fn {col_name, col_type} ->
        is_binary(col_name) and byte_size(col_name) > 0 and
        is_binary(col_type) and byte_size(col_type) > 0
       end) do
      :ok
    else
      {:error, "Invalid columns format."}
    end
  end

  defp validate_columns(_), do: {:error, "Columns must be a non-empty map."}

  defp validate_relationships(relationships) when is_map(relationships) do
    if Enum.all?(relationships, fn {col_name, rel} ->
         is_binary(col_name) and map_size(rel) == 2 and
           Map.has_key?(rel, "table") and is_binary(rel["table"]) and
           Map.has_key?(rel, "column") and is_binary(rel["column"])
       end) do
      :ok
    else
      {:error, "Invalid relationships format."}
    end
  end

  defp validate_relationships(_), do: {:error, "Relationships must be a map."}

end
