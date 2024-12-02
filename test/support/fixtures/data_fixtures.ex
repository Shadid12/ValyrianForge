defmodule ValyrianForge.DataFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `ValyrianForge.Data` context.
  """

  @doc """
  Generate a table.
  """
  def table_fixture(attrs \\ %{}) do
    {:ok, table} =
      attrs
      |> Enum.into(%{
        name: "some name"
      })
      |> ValyrianForge.Data.create_table()

    table
  end
end
