import BasicMenu from "../components/menus/BasicMenu";

const BasicLayout = ({ children }) => {
  return (
    <>
      {/* 상단 네비게이션 */}
      <BasicMenu />

      {/* 메인 레이아웃 */}
      <div className="flex justify-center bg-gray-50">
        <main className="w-full justify-center max-w-6xl bg-white rounded-xl shadow-md p-8">
          {children}
        </main>
      </div>
    </>
  );
};

export default BasicLayout;
