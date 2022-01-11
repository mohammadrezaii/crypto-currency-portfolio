import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex bg-milky">
      <Sidebar />
      <section className="flex-1 max-w-screen-xl">
        <Header />
        <main className="px-10">{children}</main>
      </section>
    </div>
  );
};

export default Layout;