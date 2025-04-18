import BasicMenu from "../components/menus/BasicMenu";

const BasicLayout = ({ children }) => {
  return (
    <>
      {/* 기존 헤더 대신 BasicMenu */}
      <BasicMenu />

      {/* 상단 여백 my-5 제거하고 일관된 디자인 유지 */}
      <div className="bg-white py-10 w-full flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      
        <main className="bg-gray-100 md:w-4/5 lg:w-3/4 px-6 py-6 rounded-lg shadow-md">
          {children}
        </main>
        
      </div>
    </>
  );
};

export default BasicLayout;
