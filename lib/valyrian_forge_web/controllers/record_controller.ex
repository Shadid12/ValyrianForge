defmodule ValyrianForgeWeb.RecordController do
  use ValyrianForgeWeb, :controller
  alias ValyrianForge.LibSQLClient
  require Logger

  # List all records
  def index(conn, %{"table_name" => table_name}) do
    query = "SELECT * FROM #{table_name};"

    case LibSQLClient.query(query) do
      {:ok, [%{"results" => %{"columns" => columns, "rows" => rows}}]} ->
        records = Enum.map(rows, fn row -> Enum.zip(columns, row) |> Enum.into(%{}) end)

        conn
        |> put_status(:ok)
        |> json(%{data: records})

      {:error, reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: reason})
    end
  end

  # Show a single record by ID
  def show(conn, %{"table_name" => table_name, "id" => id}) do
    query = "SELECT * FROM #{table_name} WHERE id = ?;"

    case LibSQLClient.query(query, [id]) do
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
      columns = Enum.map(data, fn {k, _} -> k end) |> Enum.join(", ")
      placeholders = Enum.map(data, fn _ -> "?" end) |> Enum.join(", ")
      values = Enum.map(data, fn {_, v} -> v end)

      query = "INSERT INTO #{table_name} (#{columns}) VALUES (#{placeholders});"

      case ValyrianForge.LibSQLClient.query_with_params(query, values) do
        {:ok, _response} ->
          conn
          |> put_status(:created)
          |> json(%{message: "Record created successfully."})

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

    case LibSQLClient.query(query, values) do
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
