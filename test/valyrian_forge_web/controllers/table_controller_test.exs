defmodule ValyrianForgeWeb.TableControllerTest do
  use ValyrianForgeWeb.ConnCase

  import ValyrianForge.DataFixtures

  alias ValyrianForge.Data.Table

  @create_attrs %{
    name: "some name"
  }
  @update_attrs %{
    name: "some updated name"
  }
  @invalid_attrs %{name: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all tables", %{conn: conn} do
      conn = get(conn, ~p"/api/tables")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create table" do
    test "renders table when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/tables", table: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/tables/#{id}")

      assert %{
               "id" => ^id,
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/tables", table: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update table" do
    setup [:create_table]

    test "renders table when data is valid", %{conn: conn, table: %Table{id: id} = table} do
      conn = put(conn, ~p"/api/tables/#{table}", table: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/tables/#{id}")

      assert %{
               "id" => ^id,
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, table: table} do
      conn = put(conn, ~p"/api/tables/#{table}", table: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete table" do
    setup [:create_table]

    test "deletes chosen table", %{conn: conn, table: table} do
      conn = delete(conn, ~p"/api/tables/#{table}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/tables/#{table}")
      end
    end
  end

  defp create_table(_) do
    table = table_fixture()
    %{table: table}
  end
end
