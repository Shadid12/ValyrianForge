defmodule ValyrianForge.LibSQLClient do
  @moduledoc """
  A client for interacting with a libsql server.
  """

  @base_url "http://127.0.0.1:8000"
  @headers [{"Content-Type", "application/json"}]

  require Logger

  def query(statement) do
    body = %{
      "statements" => [statement]
    }
    |> Jason.encode!()

    case HTTPoison.post(@base_url, body, @headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: response_body}} ->
        case Jason.decode(response_body) do
          {:ok, decoded_response} -> {:ok, decoded_response}
          {:error, _} -> {:error, "Failed to decode JSON response"}
        end

      {:ok, %HTTPoison.Response{status_code: status_code}} ->
        {:error, "Request failed with status code #{status_code}"}

      {:error, %HTTPoison.Error{reason: reason}} ->
        {:error, "Request failed: #{inspect(reason)}"}
    end
  end

  def query_with_params(statement, params \\ []) do
    Logger.debug("Executing SQL: #{statement} with params: #{inspect(params)}")

    body = %{
      "statements" => [%{
        "q" => statement,   # Change `sql` to `q`
        "params" => params  # Change `args` to `params`
      }]
    }
    |> Jason.encode!()

    case HTTPoison.post(@base_url, body, @headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: response_body}} ->
        case Jason.decode(response_body) do
          {:ok, decoded_response} -> {:ok, decoded_response}
          {:error, _} -> {:error, "Failed to decode JSON response"}
        end

      {:ok, %HTTPoison.Response{status_code: status_code, body: response_body}} ->
        Logger.error("Request failed with status code: #{status_code}. Response: #{response_body}")
        {:error, "Request failed with status code #{status_code}"}

      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.error("Request failed: #{inspect(reason)}")
        {:error, "Request failed: #{inspect(reason)}"}
    end
  end


end
