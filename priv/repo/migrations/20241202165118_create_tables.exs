defmodule ValyrianForge.Repo.Migrations.CreateTables do
  use Ecto.Migration

  def change do
    create table(:tables) do
      add :name, :string

      timestamps(type: :utc_datetime)
    end
  end
end
