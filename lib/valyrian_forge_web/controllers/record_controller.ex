defmodule ValyrianForgeWeb.RecordController do
  use ValyrianForgeWeb, :controller
  alias ValyrianForge.LibSQLClient
  require Logger

  # List all records with pagination
  def index(conn, %{"table_name" => table_name} = params) do
    page = Map.get(params, "page", "1") |> String.to_integer()
    limit = Map.get(params, "limit", "10") |> String.to_integer()

    # Calculate offset
    offset = (page - 1) * limit

    query = "SELECT * FROM #{table_name} LIMIT ? OFFSET ?;"

    case LibSQLClient.query_with_params(query, [limit, offset]) do
      {:ok, [%{"results" => %{"columns" => columns, "rows" => rows}}]} ->
        records = Enum.map(rows, fn row -> Enum.zip(columns, row) |> Enum.into(%{}) end)

        conn
        |> put_status(:ok)
        |> json(%{data: records, page: page, limit: limit})

      {:error, reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: reason})
    end
  end


  # Show a single record by ID
  def show(conn, %{"table_name" => table_name, "id" => id}) do
    query = "SELECT * FROM #{table_name} WHERE id = ?;"

    case LibSQLClient.query_with_params(query, [id]) do
      {:ok, [%{"results" => %{"columns" => columns, "rows" => [row]}}]} ->
        record = Enum.zip(columns, row) |> Enum.into(%{})

        conn
        |> put_status(:ok)
        |> json(%{data: record})

      {:ok, _response} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Record not found."})

      {:error, reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: reason})
    end
  end

  # Create a new record
  def create(conn, %{"table_name" => table_name, "data" => data}) do
    try do
      # Generate a unique ID
      unique_id = UUID.uuid4()
      # Add the unique ID to the data
      data_with_id = Map.put(data, "id", unique_id)

      # Prepare query parameters
      columns = Enum.map(data_with_id, fn {k, _} -> k end) |> Enum.join(", ")
      placeholders = Enum.map(data_with_id, fn _ -> "?" end) |> Enum.join(", ")
      values = Enum.map(data_with_id, fn {_, v} -> v end)

      query = "INSERT INTO #{table_name} (#{columns}) VALUES (#{placeholders});"

      case ValyrianForge.LibSQLClient.query_with_params(query, values) do
        {:ok, _response} ->
          conn
          |> put_status(:created)
          |> json(%{message: "Record created successfully.", id: unique_id})

        {:error, reason} ->
          Logger.error("Failed to execute query: #{query} with values: #{inspect(values)}. Reason: #{reason}")
          conn
          |> put_status(:internal_server_error)
          |> json(%{error: reason})
      end
    rescue
      exception ->
        Logger.error("Unexpected error: #{inspect(exception)}")
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: "An unexpected error occurred."})
    end
  end



  # Update a record by ID
  def update(conn, %{"table_name" => table_name, "id" => id, "data" => data}) do
    set_clause = Enum.map(data, fn {k, _} -> "#{k} = ?" end) |> Enum.join(", ")
    values = Enum.map(data, fn {_, v} -> v end) ++ [id]

    query = "UPDATE #{table_name} SET #{set_clause} WHERE id = ?;"

    case LibSQLClient.query_with_params(query, values) do
      {:ok, _response} ->
        conn
        |> put_status(:ok)
        |> json(%{message: "Record updated successfully."})

      {:error, reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: reason})
    end
  end

  # Delete a record by ID
  def delete(conn, %{"table_name" => table_name, "id" => id}) do
    query = "DELETE FROM #{table_name} WHERE id = ?;"

    case LibSQLClient.query(query, [id]) do
      {:ok, _response} ->
        conn
        |> put_status(:ok)
        |> json(%{message: "Record deleted successfully."})

      {:error, reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: reason})
    end
  end
end
