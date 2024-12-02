defmodule ValyrianForge.Data.Table do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tables" do
    field :name, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(table, attrs) do
    table
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
