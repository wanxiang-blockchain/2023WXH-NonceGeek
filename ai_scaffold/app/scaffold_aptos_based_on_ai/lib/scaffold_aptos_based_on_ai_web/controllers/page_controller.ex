defmodule ScaffoldAptosBasedOnAIWeb.PageController do
  use ScaffoldAptosBasedOnAIWeb, :controller

  def home(conn, _params) do
    render(conn, :home, active_tab: :home)
  end
end
