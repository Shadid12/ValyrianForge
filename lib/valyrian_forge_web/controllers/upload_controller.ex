defmodule ValyrianForgeWeb.UploadController do
  use ValyrianForgeWeb, :controller
  require Logger
  alias Ecto.UUID
  alias ValyrianForge.LibSQLClient

  def create(conn, %{
        "file" => upload,
        "table_name" => table_name,
        "field_name" => field_name
      }) do
    case upload_file(upload, table_name, field_name) do
      {:ok, file_path} ->
        case save_file_path_to_db(table_name, field_name, file_path) do
          {:ok, _result} ->
            json(conn, %{status: "success", path: file_path})

          {:error, reason} ->
            Logger.error("Failed to save file path to database: #{inspect(reason)}")
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{status: "error", reason: "Failed to save file path to database"})
        end

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{status: "error", reason: reason})
    end
  end

  # Function to handle file upload and directory creation
  defp upload_file(%Plug.Upload{filename: filename, path: temp_path}, table_name, field_name) do
    uuid = UUID.generate()
    target_dir = Path.join(["uploads", table_name, field_name, uuid])
    File.mkdir_p!(target_dir)

    target_path = Path.join(target_dir, "original_" <> filename)

    case File.cp(temp_path, target_path) do
      :ok ->
        {:ok, target_path}

      {:error, reason} ->
        Logger.error("Failed to upload file: #{inspect(reason)}")
        {:error, "File upload failed"}
    end
  end

  # Function to save the file path into the table/field in the database
  defp save_file_path_to_db(table_name, field_name, file_path) do
    statement = """
    INSERT INTO #{table_name} (#{field_name}) VALUES ($1)
    """

    params = [file_path]

    case LibSQLClient.query_with_params(statement, params) do
      {:ok, response} ->
        {:ok, response}

      {:error, reason} ->
        {:error, reason}
    end
  end
end
