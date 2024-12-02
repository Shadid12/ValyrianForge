defmodule ValyrianForge.DataTest do
  use ValyrianForge.DataCase

  alias ValyrianForge.Data

  describe "tables" do
    alias ValyrianForge.Data.Table

    import ValyrianForge.DataFixtures

    @invalid_attrs %{name: nil}

    test "list_tables/0 returns all tables" do
      table = table_fixture()
      assert Data.list_tables() == [table]
    end

    test "get_table!/1 returns the table with given id" do
      table = table_fixture()
      assert Data.get_table!(table.id) == table
    end

    test "create_table/1 with valid data creates a table" do
      valid_attrs = %{name: "some name"}

      assert {:ok, %Table{} = table} = Data.create_table(valid_attrs)
      assert table.name == "some name"
    end

    test "create_table/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Data.create_table(@invalid_attrs)
    end

    test "update_table/2 with valid data updates the table" do
      table = table_fixture()
      update_attrs = %{name: "some updated name"}

      assert {:ok, %Table{} = table} = Data.update_table(table, update_attrs)
      assert table.name == "some updated name"
    end

    test "update_table/2 with invalid data returns error changeset" do
      table = table_fixture()
      assert {:error, %Ecto.Changeset{}} = Data.update_table(table, @invalid_attrs)
      assert table == Data.get_table!(table.id)
    end

    test "delete_table/1 deletes the table" do
      table = table_fixture()
      assert {:ok, %Table{}} = Data.delete_table(table)
      assert_raise Ecto.NoResultsError, fn -> Data.get_table!(table.id) end
    end

    test "change_table/1 returns a table changeset" do
      table = table_fixture()
      assert %Ecto.Changeset{} = Data.change_table(table)
    end
  end
end
